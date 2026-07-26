# pyrefly: ignore [missing-import]
from datetime import timedelta
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from fastapi.security import OAuth2PasswordRequestForm
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from pydantic import ValidationError

from app.db.database import get_db
from app.core.config import settings
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
)
from app.core.lookups import id_por_codigo
from app.models.usuario import Usuario
from app.models.refugio import Refugio
from app.models.catalogos import Rol, TipoDocumento
from app.schemas.usuario import UsuarioCreate, UsuarioResponse, ProfileUpdate, ProfileResponse
from app.schemas.token import Token
from app.schemas.serializers import serialize_usuario

router = APIRouter()


def _slugify(texto: str) -> str:
    base = "".join(c.lower() if c.isalnum() else "-" for c in texto).strip("-")
    while "--" in base:
        base = base.replace("--", "-")
    return base or "refugio"


@router.post("/register", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UsuarioCreate, db: Session = Depends(get_db)):
    existing = db.query(Usuario).filter(Usuario.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="El correo ya esta registrado")

    # Resuelve el rol (por codigo o nombre); por defecto 'usuario'.
    rol_obj = (
        db.query(Rol)
        .filter((Rol.codigo == payload.rol) | (Rol.nombre.ilike(payload.rol)))
        .first()
    )
    # El registro PUBLICO solo permite 'usuario' o 'refugio'.
    # Los administradores/tiendas se crean desde el panel de administracion.
    if rol_obj is None or rol_obj.codigo not in ("usuario", "refugio"):
        rol_obj = db.query(Rol).filter(Rol.codigo == "usuario").first()
    if rol_obj is None:
        raise HTTPException(status_code=500, detail="Catalogo de roles no inicializado")

    tipo_doc_id = id_por_codigo(db, TipoDocumento, payload.tipo_documento)

    user = Usuario(
        nombre=payload.nombre,
        apellido=payload.apellido,
        tipo_documento_id=tipo_doc_id,
        numero_documento=payload.numero_documento,
        telefono=payload.telefono,
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
        rol_id=rol_obj.id,
        ubicacion=payload.ubicacion,
    )
    db.add(user)
    db.flush()  # obtiene user.id sin cerrar la transaccion

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
    return serialize_usuario(user)


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # El campo "username" del formulario OAuth2 contiene el email.
    user = db.query(Usuario).filter(Usuario.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contrasena incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me")
def read_me(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    """Devuelve el usuario autenticado con la forma que espera el frontend."""
    nombre_completo = f"{current_user.nombre} {current_user.apellido or ''}".strip()
    rol_codigo = current_user.rol_codigo
    data = {
        "id": current_user.id,
        "name": nombre_completo,
        "nombre": nombre_completo,
        "apellido": current_user.apellido,
        "email": current_user.email,
        "phone": current_user.telefono,
        "location": current_user.ubicacion,
        "role": rol_codigo,
        "rol": rol_codigo,
        "estado": "activo" if current_user.activo else "inactivo",
        "settings": {"storeEnabled": False},
    }
    # Para administradores, entrega los permisos que espera el panel admin.
    if rol_codigo in ("administrador", "administrador_principal"):
        todos = rol_codigo == "administrador_principal"
        data["permisos"] = {
            "usuarios": True, "refugios": True, "mascotas": True,
            "marketplace": todos, "pedidos": todos, "foro": True,
            "reportes": True, "pqrs": True, "estadisticas": todos,
            "administradores": todos, "configuracion": todos,
        }
    if rol_codigo == "refugio":
        refugio = db.query(Refugio).filter(Refugio.usuario_id == current_user.id).first()
        if refugio:
            data["name"] = refugio.nombre
            data["shelterId"] = refugio.id
            data["description"] = refugio.descripcion
            data["address"] = refugio.direccion
            data["location"] = refugio.ubicacion or current_user.ubicacion
            data["settings"] = {"storeEnabled": bool(refugio.tienda_habilitada)}
    if rol_codigo == "tienda_aliada":
        from app.models.tienda import Tienda
        tienda = db.query(Tienda).filter(Tienda.usuario_id == current_user.id).first()
        if tienda:
            data["name"] = tienda.nombre
            data["storeId"] = tienda.id
            data["storeName"] = tienda.nombre
            data["storeSlug"] = tienda.slug
            data["description"] = tienda.descripcion
            data["location"] = tienda.ciudad or tienda.ubicacion
            data["phone"] = tienda.telefono or current_user.telefono
            data["settings"] = {"storeEnabled": True}
    return data


@router.get("/profile", response_model=ProfileResponse)
def get_profile(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    """Devuelve el perfil completo del usuario autenticado."""
    tipo_doc = current_user.tipo_documento.codigo if current_user.tipo_documento else None
    return ProfileResponse(
        id=current_user.id,
        nombre=current_user.nombre,
        apellido=current_user.apellido,
        email=current_user.email,
        telefono=current_user.telefono,
        tipo_documento=tipo_doc,
        numero_documento=current_user.numero_documento,
        ubicacion=current_user.ubicacion,
        bio=current_user.bio,
        website=current_user.website,
        avatar_url=current_user.avatar_url,
        cover_url=current_user.cover_url,
        twitter=current_user.twitter,
        instagram=current_user.instagram,
        perfil_completo=current_user.perfil_completo if hasattr(current_user, "perfil_completo") else False,
    )


@router.put("/profile", response_model=ProfileResponse)
def update_profile(
    payload: ProfileUpdate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Actualiza los datos del perfil del usuario autenticado.

    Si el usuario completa todos los campos opcionales requeridos,
    se marca automaticamente como perfil_completo = True.
    """
    update_data = payload.model_dump(exclude_unset=True)

    # Actualizar solo los campos enviados
    for field, value in update_data.items():
        if value is not None:
            setattr(current_user, field, value)

    # Verificar si el perfil esta completo (campos minimos deseables)
    # Consideramos "completo" si tiene bio, telefono, ubicacion y al menos
    # uno de: website, twitter, instagram
    tiene_bio = bool(current_user.bio and current_user.bio.strip())
    tiene_telefono = bool(current_user.telefono and current_user.telefono.strip())
    tiene_ubicacion = bool(current_user.ubicacion and current_user.ubicacion.strip())
    tiene_social = bool(
        (current_user.website and current_user.website.strip())
        or (current_user.twitter and current_user.twitter.strip())
        or (current_user.instagram and current_user.instagram.strip())
    )

    if tiene_bio and tiene_telefono and tiene_ubicacion and tiene_social:
        current_user.perfil_completo = True
    else:
        current_user.perfil_completo = False

    db.commit()
    db.refresh(current_user)

    tipo_doc = current_user.tipo_documento.codigo if current_user.tipo_documento else None
    return ProfileResponse(
        id=current_user.id,
        nombre=current_user.nombre,
        apellido=current_user.apellido,
        email=current_user.email,
        telefono=current_user.telefono,
        tipo_documento=tipo_doc,
        numero_documento=current_user.numero_documento,
        ubicacion=current_user.ubicacion,
        bio=current_user.bio,
        website=current_user.website,
        avatar_url=current_user.avatar_url,
        cover_url=current_user.cover_url,
        twitter=current_user.twitter,
        instagram=current_user.instagram,
        perfil_completo=current_user.perfil_completo,
    )
