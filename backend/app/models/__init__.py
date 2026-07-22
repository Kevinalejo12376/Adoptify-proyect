"""Importa todos los modelos para que SQLAlchemy los registre en Base.metadata."""
from app.models.catalogos import (
    TipoDocumento,
    Rol,
    TipoMascota,
    TamanoMascota,
    GeneroMascota,
    EstadoMascota,
    EstadoSolicitud,
    EstadoPedido,
    CategoriaProducto,
    ForoCategoria,
    TipoPostForo,
    EstadoPostForo,
    TipoReaccion,
)
from app.models.usuario import Usuario
from app.models.refugio import Refugio
from app.models.mascota import Mascota
from app.models.solicitud import SolicitudAdopcion
from app.models.tienda import Tienda
from app.models.producto import Producto

__all__ = [
    "TipoDocumento", "Rol", "TipoMascota", "TamanoMascota", "GeneroMascota",
    "EstadoMascota", "EstadoSolicitud", "EstadoPedido", "CategoriaProducto",
    "ForoCategoria", "TipoPostForo", "EstadoPostForo", "TipoReaccion",
    "Usuario", "Refugio", "Mascota", "SolicitudAdopcion", "Tienda", "Producto",
]
