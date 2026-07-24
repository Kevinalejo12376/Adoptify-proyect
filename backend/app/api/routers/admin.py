"""Endpoints del panel de administracion. Solo para usuarios con rol
'administrador' o 'administrador_principal'. Permite gestionar (crear, listar,
editar, eliminar) usuarios, administradores y refugios."""
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status, Query
# pyrefly: ignore [missing-import]
from sqlalchemy import func
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session, joinedload
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
from app.schemas.admin import AdminUsuarioCreate, AdminUsuarioUpdate, AdminUsuarioResponse

router = APIRouter()


# Caché en memoria para id_por_codigo dentro de una misma request
_cache_ids = {}

def _id_codigo_cache(db: Session, Model, valor):
    """Idem id_por_codigo pero con caché en memoria para evitar consultas repetidas."""
    key = (Model.__tablename__, str(valor).strip().lower())
    if key not in _cache_ids:
        _cache_ids[key] = id_por_codigo(db, Model, valor)
    return _cache_ids[key]


@router.get("/estadisticas")
def estadisticas(_admin: Usuario = Depends(get_current_admin), db: Session = Depends(get_db)):
    """Conteos reales desde la base de datos para el dashboard del admin.
    Optimizado para minimizar viajes redondos a la BD (∼3 consultas vs ∼11)."""
    # Limpiar caché al inicio de cada request
    _cache_ids.clear()

    # 1) Resolver IDs de catálogo (usando caché)
    rol_usuario_id = _id_codigo_cache(db, Rol, "usuario")

    # 2) Consulta única: contar usuarios por rol
    conteo_roles = dict(
        db.query(Usuario.rol_id, func.count(Usuario.id))
        .group_by(Usuario.rol_id)
        .all()
    )
    # 3) Consulta única: conteos de mascotas agrupados por estado
    conteo_mascotas_estado = dict(
        db.query(Mascota.estado_id, func.count(Mascota.id))
        .group_by(Mascota.estado_id)
        .all()
    )

    # 4) Total de administradores (2 roles)
    total_administradores = (
        db.query(Usuario).join(Rol, Rol.id == Usuario.rol_id)
        .filter(Rol.codigo.in_(["administrador", "administrador_principal"]))
        .count()
    )

    # Resolver IDs de estados de mascota para las llaves del response
    adoptado_id = _id_codigo_cache(db, EstadoMascota, "adoptado")
    disponible_id = _id_codigo_cache(db, EstadoMascota, "disponible")

    return {
        "usuarios": conteo_roles.get(rol_usuario_id, 0) if rol_usuario_id else 0,
        "refugios": db.query(Refugio).count(),
        "administradores": total_administradores,
        "mascotas": sum(conteo_mascotas_estado.values()),
        "mascotas_disponibles": conteo_mascotas_estado.get(disponible_id, 0) if disponible_id else 0,
        "mascotas_adoptadas": conteo_mascotas_estado.get(adoptado_id, 0) if adoptado_id else 0,
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


@router.get("/mascotas")
def listar_mascotas_admin(
    _admin: Usuario = Depends(get_current_admin),
    db: Session = Depends(get_db),
    limite: int = Query(200, ge=1, le=1000, description="Maximo de mascotas a devolver"),
):
    """Lista mascotas (de todos los refugios) para supervision del admin.
    Con paginación (max 1000) y joinedload para evitar N+1 queries."""
    mascotas = (
        db.query(Mascota)
        .options(joinedload(Mascota.tipo), joinedload(Mascota.estado), joinedload(Mascota.refugio))
        .order_by(Mascota.creado_en.desc())
        .limit(limite)
        .all()
    )
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
    limite: int = Query(100, ge=1, le=500, description="Maximo de registros a devolver"),
    _admin: Usuario = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Lista usuarios con paginación opcional por rol.
    Devuelve hasta `limite` registros (default 100, max 500) para evitar
    timeouts cuando hay muchos usuarios."""
    query = db.query(Usuario).options(joinedload(Usuario.rol), joinedload(Usuario.refugio))
    if rol:
        rol_id = id_por_codigo(db, Rol, rol)
        if rol_id:
            query = query.filter(Usuario.rol_id == rol_id)
    return [_serialize(u) for u in query.order_by(Usuario.creado_en.desc()).limit(limite).all()]


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
