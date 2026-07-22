# pyrefly: ignore [missing-import]
from pydantic import BaseModel, ConfigDict
# pyrefly: ignore [missing-import]
from typing import Optional


class UsuarioCreate(BaseModel):
    nombre: str
    apellido: Optional[str] = None
    email: str
    password: str
    telefono: Optional[str] = None
    # codigo del catalogo tipos_documento (ej: 'CC') u opcional
    tipo_documento: Optional[str] = None
    numero_documento: Optional[str] = None
    # codigo del catalogo roles: 'usuario' | 'refugio'
    rol: str = "usuario"
    ubicacion: Optional[str] = None
    # Nombre del refugio (solo si rol == 'refugio')
    nombre_refugio: Optional[str] = None


class UsuarioResponse(BaseModel):
    id: int
    nombre: str
    apellido: Optional[str] = None
    email: str
    telefono: Optional[str] = None
    rol: Optional[str] = None
    tipo_documento: Optional[str] = None
    numero_documento: Optional[str] = None
    ubicacion: Optional[str] = None
