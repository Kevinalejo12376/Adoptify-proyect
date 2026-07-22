# pyrefly: ignore [missing-import]
from pydantic import BaseModel
# pyrefly: ignore [missing-import]
from typing import Optional


class AdminUsuarioCreate(BaseModel):
    nombre: str
    apellido: Optional[str] = None
    email: str
    password: str
    telefono: Optional[str] = None
    tipo_documento: Optional[str] = None
    numero_documento: Optional[str] = None
    # rol: usuario | refugio | administrador | administrador_principal | tienda_aliada
    rol: str = "usuario"
    ubicacion: Optional[str] = None
    nombre_refugio: Optional[str] = None


class AdminUsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    telefono: Optional[str] = None
    ubicacion: Optional[str] = None
    activo: Optional[bool] = None


class AdminUsuarioResponse(BaseModel):
    id: int
    nombre: str
    apellido: Optional[str] = None
    email: str
    telefono: Optional[str] = None
    activo: bool = True
    ubicacion: Optional[str] = None
    rol: Optional[str] = None
    rol_nombre: Optional[str] = None
    refugio_nombre: Optional[str] = None
    creado_en: Optional[str] = None
