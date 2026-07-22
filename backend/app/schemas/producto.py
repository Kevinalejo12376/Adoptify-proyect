# pyrefly: ignore [missing-import]
from pydantic import BaseModel
# pyrefly: ignore [missing-import]
from typing import Optional


class ProductoCreate(BaseModel):
    nombre: str
    # codigo del catalogo categorias_producto (o nombre)
    categoria: Optional[str] = None
    precio: float = 0
    descripcion: Optional[str] = None
    descripcion_larga: Optional[str] = None
    calidad: Optional[str] = None
    stock: int = 0
    marca: Optional[str] = None
    material: Optional[str] = None
    tallas: Optional[str] = None
    colores: Optional[str] = None


class ProductoResponse(BaseModel):
    id: int
    nombre: str
    precio: float = 0
    descripcion: Optional[str] = None
    descripcion_larga: Optional[str] = None
    calidad: Optional[str] = None
    stock: int = 0
    marca: Optional[str] = None
    material: Optional[str] = None
    tallas: Optional[str] = None
    colores: Optional[str] = None
    activo: bool = True
    ventas: int = 0
    rating: float = 0
    categoria: Optional[str] = None
    categoria_id: Optional[int] = None
    refugio_id: Optional[int] = None
    tienda_id: Optional[int] = None
