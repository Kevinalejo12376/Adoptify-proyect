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
from app.schemas.producto import ProductoCreate, ProductoUpdate, ProductoResponse
from app.schemas.serializers import serialize_producto

router = APIRouter()


def _refugio_de(current_user: Usuario, db: Session) -> Refugio:
    refugio = db.query(Refugio).filter(Refugio.usuario_id == current_user.id).first()
    if not refugio:
        raise HTTPException(status_code=404, detail="Refugio no encontrado")
    return refugio


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


@router.get("/mios", response_model=List[ProductoResponse])
def mis_productos(
    current_user: Usuario = Depends(get_current_refugio),
    db: Session = Depends(get_db),
):
    """Productos del refugio autenticado."""
    refugio = _refugio_de(current_user, db)
    productos = (
        db.query(Producto)
        .filter(Producto.refugio_id == refugio.id)
        .order_by(Producto.creado_en.desc())
        .all()
    )
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


def _producto_del_refugio(producto_id: int, current_user: Usuario, db: Session) -> Producto:
    refugio = _refugio_de(current_user, db)
    producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    if producto.refugio_id != refugio.id:
        raise HTTPException(status_code=403, detail="No puedes modificar este producto")
    return producto


@router.put("/{producto_id}", response_model=ProductoResponse)
def actualizar_producto(
    producto_id: int,
    payload: ProductoUpdate,
    current_user: Usuario = Depends(get_current_refugio),
    db: Session = Depends(get_db),
):
    producto = _producto_del_refugio(producto_id, current_user, db)
    datos = payload.model_dump(exclude_unset=True)
    if "categoria" in datos:
        producto.categoria_id = id_por_codigo(db, CategoriaProducto, datos.pop("categoria"))
    for campo, valor in datos.items():
        setattr(producto, campo, valor)
    db.commit()
    db.refresh(producto)
    return serialize_producto(producto)


@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(
    producto_id: int,
    current_user: Usuario = Depends(get_current_refugio),
    db: Session = Depends(get_db),
):
    producto = _producto_del_refugio(producto_id, current_user, db)
    db.delete(producto)
    db.commit()
    return None
