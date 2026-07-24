"""Endpoints del panel de administracion. Solo para usuarios con rol
'administrador' o 'administrador_principal'. Permite gestionar (crear, listar,
editar, eliminar) usuarios, administradores y refugios."""
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status, Query
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from typing import Optional, List

from app.db.database import get_db
from app.core.security import get_current_admin, get_password_hash
from app.core.lookups import id_por_codigo
from app.models.usuario import Usuario
from app.models.refugio import Refugio
from app.models.mascota import Mascota
from app.models.solicitud import SolicitudAdopcion
from app.models.producto import Producto
from app.models.catalogos import Rol, TipoDocumento, EstadoMascota
from app.models.soporte import Pqrs, Reporte, Auditoria
from app.models.pedido import Pedido
from app.models.foro import ForoPost
from app.schemas.admin import AdminUsuarioCreate, AdminUsuarioUpdate, AdminUsuarioResponse
from app.schemas.soporte import PqrsEstadoUpdate, ReporteEstadoUpdate
from app.core.notificaciones import registrar_auditoria

router = APIRouter()


@router.get("/estadisticas")
def estadisticas(_admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Conteos reales desde la base de datos para el dashboard del admin."""
    def contar_rol(codigo: str) -> int:
        rid = id_por_codigo(db, Rol, codigo)
        return db.query(Usuario).filter(Usuario.rol_id == rid).count() if rid else 0

    total_administradores = (
        db.query(Usuario).join(Rol, Rol.id == Usuario.rol_id)
        .filter(Rol.codigo.in_(["administrador", "administrador_principal"]))
        .count()
    )
    adoptado_id = id_por_codigo(db, EstadoMascota, "adoptado")
    disponible_id = id_por_codigo(db, EstadoMascota, "disponible")

    return {
        "usuarios": contar_rol("usuario"),
        "refugios": db.query(Refugio).count(),
        "administradores": total_administradores,
        "mascotas": db.query(Mascota).count(),
        "mascotas_disponibles": db.query(Mascota).filter(Mascota.estado_id == disponible_id).count() if disponible_id else 0,
        "mascotas_adoptadas": db.query(Mascota).filter(Mascota.estado_id == adoptado_id).count() if adoptado_id else 0,
        "solicitudes": db.query(SolicitudAdopcion).count(),
        "productos": db.query(Producto).count(),
    }

ROLES_VALIDOS = {"usuario", "refugio", "administrador", "administrador_principal", "tienda_aliada"}


def _slugify(texto: str) -> str:
    base = "".join(c.lower() if c.isalnum() else "-" for c in texto).strip("-")
    while "--" in base:
        base = base.replace("--", "-")
    return base or "refugio"


def _serialize(u: Usuario) -> dict:
    return {
        "id": u.id,
        "nombre": u.nombre,
        "apellido": u.apellido,
        "email": u.email,
        "telefono": u.telefono,
        "activo": u.activo,
        "ubicacion": u.ubicacion,
        "rol": u.rol.codigo if u.rol else None,
        "rol_nombre": u.rol.nombre if u.rol else None,
        "refugio_nombre": u.refugio.nombre if u.refugio else None,
        "creado_en": u.creado_en.isoformat() if u.creado_en else None,
    }


@router.get("/productos")
def listar_productos_admin(_admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Lista TODOS los productos con su vendedor (tienda o refugio)."""
    productos = db.query(Producto).order_by(Producto.creado_en.desc()).all()
    ref_ids = {p.refugio_id for p in productos if p.refugio_id}
    refs = {}
    if ref_ids:
        refs = {r.id: r.nombre for r in db.query(Refugio).filter(Refugio.id.in_(ref_ids)).all()}
    resultado = []
    for p in productos:
        vendedor = p.tienda.nombre if p.tienda else refs.get(p.refugio_id)
        resultado.append({
            "id": p.id,
            "nombre": p.nombre,
            "categoria": p.categoria.nombre if p.categoria else None,
            "precio": float(p.precio) if p.precio is not None else 0,
            "stock": p.stock,
            "activo": p.activo,
            "vendedor": vendedor or "—",
            "tipo_vendedor": "Tienda" if p.tienda_id else ("Refugio" if p.refugio_id else "—"),
            "creado_en": p.creado_en.isoformat() if p.creado_en else None,
        })
    return resultado


@router.delete("/productos/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto_admin(
    producto_id: int,
    _admin: Usuario = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    p = db.query(Producto).filter(Producto.id == producto_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(p)
    db.commit()
    return None


@router.get("/mascotas")
def listar_mascotas_admin(_admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Lista TODAS las mascotas (de todos los refugios) para supervision del admin."""
    mascotas = db.query(Mascota).order_by(Mascota.creado_en.desc()).all()
    return [
        {
            "id": m.id,
            "nombre": m.nombre,
            "tipo": m.tipo.nombre if m.tipo else None,
            "raza": m.raza,
            "edad": m.edad,
            "estado": m.estado.codigo if m.estado else None,
            "refugio": m.refugio.nombre if m.refugio else None,
            "refugio_id": m.refugio_id,
            "creado_en": m.creado_en.isoformat() if m.creado_en else None,
        }
        for m in mascotas
    ]


@router.delete("/mascotas/{mascota_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_mascota_admin(
    mascota_id: int,
    _admin: Usuario = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    m = db.query(Mascota).filter(Mascota.id == mascota_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Mascota no encontrada")
    db.delete(m)
    db.commit()
    return None


@router.get("/usuarios", response_model=List[AdminUsuarioResponse])
def listar_usuarios(
    rol: Optional[str] = Query(None, description="Filtrar por rol (codigo)"),
    _admin: Usuario = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    query = db.query(Usuario)
    if rol:
        rol_id = id_por_codigo(db, Rol, rol)
        if rol_id:
            query = query.filter(Usuario.rol_id == rol_id)
    return [_serialize(u) for u in query.order_by(Usuario.creado_en.desc()).all()]


@router.post("/usuarios", response_model=AdminUsuarioResponse, status_code=status.HTTP_201_CREATED)
def crear_usuario(
    payload: AdminUsuarioCreate,
    _admin: Usuario = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    if payload.rol not in ROLES_VALIDOS:
        raise HTTPException(status_code=400, detail="Rol invalido")
    if db.query(Usuario).filter(Usuario.email == payload.email).first():
        raise HTTPException(status_code=400, detail="El correo ya esta registrado")

    rol_obj = db.query(Rol).filter(Rol.codigo == payload.rol).first()
    if rol_obj is None:
        raise HTTPException(status_code=400, detail="Rol no encontrado en catalogo")

    user = Usuario(
        nombre=payload.nombre,
        apellido=payload.apellido,
        tipo_documento_id=id_por_codigo(db, TipoDocumento, payload.tipo_documento),
        numero_documento=payload.numero_documento,
        telefono=payload.telefono,
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        rol_id=rol_obj.id,
        ubicacion=payload.ubicacion,
    )
    db.add(user)
    db.flush()

    if rol_obj.codigo == "refugio":
        nombre_refugio = payload.nombre_refugio or f"{payload.nombre} {payload.apellido or ''}".strip()
        slug = _slugify(nombre_refugio)
        if db.query(Refugio).filter(Refugio.slug == slug).first():
            slug = f"{slug}-{user.id}"
        db.add(Refugio(
            usuario_id=user.id,
            nombre=nombre_refugio,
            slug=slug,
            telefono=payload.telefono,
            email=payload.email,
            ubicacion=payload.ubicacion,
        ))

    db.commit()
    db.refresh(user)
    registrar_auditoria(db, _admin.id, "crear_usuario", "usuarios", user.id, f"Rol: {rol_obj.codigo}")
    db.commit()
    return _serialize(user)


@router.patch("/usuarios/{usuario_id}", response_model=AdminUsuarioResponse)
def actualizar_usuario(
    usuario_id: int,
    payload: AdminUsuarioUpdate,
    _admin: Usuario = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    user = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    for campo, valor in payload.model_dump(exclude_unset=True).items():
        setattr(user, campo, valor)
    db.commit()
    db.refresh(user)
    return _serialize(user)


@router.delete("/usuarios/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(
    usuario_id: int,
    admin: Usuario = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    if usuario_id == admin.id:
        raise HTTPException(status_code=400, detail="No puedes eliminar tu propia cuenta")
    user = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if user.rol_codigo == "administrador_principal":
        raise HTTPException(status_code=400, detail="No se puede eliminar al administrador principal")
    db.delete(user)
    db.commit()
    return None


# ============================================================
# PQRS
# ============================================================
@router.get("/pqrs")
def listar_pqrs(_admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)):
    items = db.query(Pqrs).order_by(Pqrs.creado_en.desc()).all()
    return [
        {
            "id": p.id, "usuario_id": p.usuario_id, "tipo": p.tipo,
            "asunto": p.asunto, "mensaje": p.mensaje, "estado": p.estado,
            "respuesta": p.respuesta,
            "creado_en": p.creado_en.isoformat() if p.creado_en else None,
        }
        for p in items
    ]


@router.patch("/pqrs/{pqrs_id}")
def actualizar_pqrs(pqrs_id: int, payload: PqrsEstadoUpdate, _admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)):
    p = db.query(Pqrs).filter(Pqrs.id == pqrs_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="PQRS no encontrado")
    if payload.estado is not None:
        p.estado = payload.estado
    if payload.respuesta is not None:
        p.respuesta = payload.respuesta
    db.commit()
    return {"ok": True}


# ============================================================
# REPORTES
# ============================================================
@router.get("/reportes")
def listar_reportes(_admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)):
    items = db.query(Reporte).order_by(Reporte.creado_en.desc()).all()
    return [
        {
            "id": r.id, "reportante_id": r.reportante_id, "tipo_objeto": r.tipo_objeto,
            "objeto_id": r.objeto_id, "motivo": r.motivo, "estado": r.estado,
            "creado_en": r.creado_en.isoformat() if r.creado_en else None,
        }
        for r in items
    ]


@router.patch("/reportes/{reporte_id}")
def actualizar_reporte(reporte_id: int, payload: ReporteEstadoUpdate, _admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)):
    r = db.query(Reporte).filter(Reporte.id == reporte_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    r.estado = payload.estado
    db.commit()
    return {"ok": True}


# ============================================================
# PEDIDOS
# ============================================================
@router.get("/pedidos")
def listar_pedidos(_admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)):
    pedidos = db.query(Pedido).order_by(Pedido.creado_en.desc()).all()
    return [
        {
            "id": p.id, "usuario_id": p.usuario_id,
            "estado": p.estado.codigo if p.estado else None,
            "subtotal": float(p.subtotal or 0), "costo_envio": float(p.costo_envio or 0),
            "descuento": float(p.descuento or 0), "total": float(p.total or 0),
            "creado_en": p.creado_en.isoformat() if p.creado_en else None,
        }
        for p in pedidos
    ]


# ============================================================
# FORO (moderacion)
# ============================================================
@router.get("/foro")
def listar_foro(_admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)):
    posts = db.query(ForoPost).order_by(ForoPost.creado_en.desc()).all()
    return [
        {
            "id": p.id, "titulo": p.titulo, "contenido": p.contenido,
            "autor": (f"{p.autor.nombre} {p.autor.apellido or ''}".strip() if p.autor else "Anonimo"),
            "categoria": p.categoria.nombre if p.categoria else None,
            "vistas": p.vistas,
            "creado_en": p.creado_en.isoformat() if p.creado_en else None,
        }
        for p in posts
    ]


@router.delete("/foro/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_post_foro(post_id: int, admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)):
    p = db.query(ForoPost).filter(ForoPost.id == post_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Publicacion no encontrada")
    registrar_auditoria(db, admin.id, "eliminar", "foro_post", post_id, f"Elimino publicacion '{p.titulo}'")
    db.delete(p)
    db.commit()
    return None


# ============================================================
# AUDITORIA
# ============================================================
@router.get("/auditoria")
def listar_auditoria(_admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)):
    items = db.query(Auditoria).order_by(Auditoria.creado_en.desc()).limit(200).all()
    # Mapea el id de usuario a su nombre
    user_ids = {a.usuario_id for a in items if a.usuario_id}
    nombres = {}
    if user_ids:
        nombres = {
            u.id: f"{u.nombre} {u.apellido or ''}".strip()
            for u in db.query(Usuario).filter(Usuario.id.in_(user_ids)).all()
        }
    return [
        {
            "id": a.id, "usuario": nombres.get(a.usuario_id, "Sistema"),
            "accion": a.accion, "entidad": a.entidad, "entidad_id": a.entidad_id,
            "detalle": a.detalle,
            "creado_en": a.creado_en.isoformat() if a.creado_en else None,
        }
        for a in items
    ]
