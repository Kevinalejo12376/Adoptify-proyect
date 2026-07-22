# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status, Query
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from typing import Optional, List

from app.db.database import get_db
from app.core.security import get_current_refugio
from app.core.lookups import id_por_codigo
from app.models.usuario import Usuario
from app.models.refugio import Refugio
from app.models.producto import Producto
from app.models.catalogos import CategoriaProducto
from app.schemas.producto import ProductoCreate, ProductoResponse
from app.schemas.serializers import serialize_producto

router = APIRouter()


@router.get("/", response_model=List[ProductoResponse])
def listar_productos(
    db: Session = Depends(get_db),
    categoria: Optional[str] = Query(None),
):
    query = db.query(Producto)
    if categoria and categoria != "all":
        cat_id = id_por_codigo(db, CategoriaProducto, categoria)
        if cat_id:
            query = query.filter(Producto.categoria_id == cat_id)
    productos = query.order_by(Producto.creado_en.desc()).all()
    return [serialize_producto(p) for p in productos]


@router.get("/{producto_id}", response_model=ProductoResponse)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return serialize_producto(producto)


@router.post("/", response_model=ProductoResponse, status_code=status.HTTP_201_CREATED)
def crear_producto(
    payload: ProductoCreate,
    current_user: Usuario = Depends(get_current_refugio),
    db: Session = Depends(get_db),
):
    """Crea un producto asociado al refugio autenticado."""
    refugio = db.query(Refugio).filter(Refugio.usuario_id == current_user.id).first()
    if not refugio:
        raise HTTPException(status_code=404, detail="Refugio no encontrado")
    producto = Producto(
        nombre=payload.nombre,
        categoria_id=id_por_codigo(db, CategoriaProducto, payload.categoria),
        precio=payload.precio,
        descripcion=payload.descripcion,
        descripcion_larga=payload.descripcion_larga,
        calidad=payload.calidad,
        stock=payload.stock,
        marca=payload.marca,
        material=payload.material,
        tallas=payload.tallas,
        colores=payload.colores,
        refugio_id=refugio.id,
        tienda_id=None,
    )
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return serialize_producto(producto)
