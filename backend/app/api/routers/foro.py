"""Foro / comunidad: publicaciones, comentarios y reacciones."""
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from sqlalchemy import func
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
# pyrefly: ignore [missing-import]
from typing import Optional, List

from app.db.database import get_db
from app.core.security import get_current_user
from app.core.lookups import id_por_codigo
from app.core.notificaciones import registrar_auditoria
from app.models.usuario import Usuario
from app.models.foro import ForoPost
from app.models.interaccion import ForoComentario, ForoReaccion
from app.models.catalogos import ForoCategoria, TipoPostForo, EstadoPostForo, TipoReaccion

router = APIRouter()


class PostCreate(BaseModel):
    titulo: str
    contenido: Optional[str] = None
    categoria: Optional[str] = None   # codigo de foro_categorias
    tipo: Optional[str] = None        # codigo de tipos_post_foro
    tags: Optional[str] = None


class ComentarioCreate(BaseModel):
    contenido: str
    comentario_padre_id: Optional[int] = None


class ReaccionCreate(BaseModel):
    tipo: str = "like"  # codigo de tipos_reaccion


def _autor_info(u: Usuario):
    if not u:
        return {"autor": "Anonimo", "autor_rol": None, "autor_iniciales": "?"}
    nombre = f"{u.nombre} {u.apellido or ''}".strip()
    iniciales = "".join([p[0] for p in nombre.split()[:2]]).upper() or "?"
    return {"autor": nombre, "autor_rol": u.rol_codigo if u.rol else None, "autor_iniciales": iniciales}


def _reacciones_de(db: Session, post_id: int) -> dict:
    filas = (
        db.query(TipoReaccion.codigo, func.count(ForoReaccion.id))
        .join(ForoReaccion, ForoReaccion.tipo_reaccion_id == TipoReaccion.id)
        .filter(ForoReaccion.post_id == post_id)
        .group_by(TipoReaccion.codigo)
        .all()
    )
    d = {"like": 0, "love": 0, "celebrate": 0, "support": 0, "funny": 0}
    for codigo, n in filas:
        d[codigo] = n
    return d


def _serialize_post(p: ForoPost, db: Session, incluir_comentarios: bool = False) -> dict:
    n_com = db.query(func.count(ForoComentario.id)).filter(ForoComentario.post_id == p.id).scalar()
    data = {
        "id": p.id,
        "titulo": p.titulo,
        "contenido": p.contenido,
        "categoria": p.categoria.nombre if p.categoria else None,
        "tags": p.tags.split(",") if p.tags else [],
        "fijado": p.fijado,
        "vistas": p.vistas,
        "compartidos": p.compartidos,
        "creado_en": p.creado_en.isoformat() if p.creado_en else None,
        "reacciones": _reacciones_de(db, p.id),
        "comentarios_count": n_com,
        **_autor_info(p.autor),
    }
    if incluir_comentarios:
        comentarios = (
            db.query(ForoComentario)
            .filter(ForoComentario.post_id == p.id)
            .order_by(ForoComentario.creado_en.asc())
            .all()
        )
        data["comentarios"] = [
            {
                "id": c.id,
                "contenido": c.contenido,
                "likes": c.likes,
                "comentario_padre_id": c.comentario_padre_id,
                "creado_en": c.creado_en.isoformat() if c.creado_en else None,
                **_autor_info(c.autor),
            }
            for c in comentarios
        ]
    return data


@router.get("/posts")
def listar_posts(db: Session = Depends(get_db), categoria: Optional[str] = None):
    query = db.query(ForoPost)
    if categoria and categoria != "all":
        cat_id = id_por_codigo(db, ForoCategoria, categoria)
        if cat_id:
            query = query.filter(ForoPost.categoria_id == cat_id)
    posts = query.order_by(ForoPost.fijado.desc(), ForoPost.creado_en.desc()).all()
    return [_serialize_post(p, db) for p in posts]


@router.get("/posts/{post_id}")
def obtener_post(post_id: int, db: Session = Depends(get_db)):
    p = db.query(ForoPost).filter(ForoPost.id == post_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Publicacion no encontrada")
    p.vistas = (p.vistas or 0) + 1
    db.commit()
    db.refresh(p)
    return _serialize_post(p, db, incluir_comentarios=True)


@router.post("/posts", status_code=status.HTTP_201_CREATED)
def crear_post(payload: PostCreate, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    estado_id = id_por_codigo(db, EstadoPostForo, "published", requerido=True)
    post = ForoPost(
        autor_id=current_user.id,
        categoria_id=id_por_codigo(db, ForoCategoria, payload.categoria),
        tipo_id=id_por_codigo(db, TipoPostForo, payload.tipo),
        estado_id=estado_id,
        titulo=payload.titulo,
        contenido=payload.contenido,
        tags=payload.tags,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return _serialize_post(post, db)


@router.post("/posts/{post_id}/comentarios", status_code=status.HTTP_201_CREATED)
def comentar(post_id: int, payload: ComentarioCreate, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.query(ForoPost).filter(ForoPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Publicacion no encontrada")
    com = ForoComentario(
        post_id=post_id,
        autor_id=current_user.id,
        comentario_padre_id=payload.comentario_padre_id,
        contenido=payload.contenido,
    )
    db.add(com)
    db.commit()
    db.refresh(com)
    return {"id": com.id, "contenido": com.contenido, **_autor_info(current_user)}


@router.post("/posts/{post_id}/reacciones")
def reaccionar(post_id: int, payload: ReaccionCreate, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    tipo_id = id_por_codigo(db, TipoReaccion, payload.tipo, requerido=True)
    existe = db.query(ForoReaccion).filter(
        ForoReaccion.post_id == post_id,
        ForoReaccion.usuario_id == current_user.id,
        ForoReaccion.tipo_reaccion_id == tipo_id,
    ).first()
    if existe:
        db.delete(existe)  # toggle: quitar reaccion
        db.commit()
        return {"activo": False, "reacciones": _reacciones_de(db, post_id)}
    db.add(ForoReaccion(post_id=post_id, usuario_id=current_user.id, tipo_reaccion_id=tipo_id))
    db.commit()
    return {"activo": True, "reacciones": _reacciones_de(db, post_id)}
