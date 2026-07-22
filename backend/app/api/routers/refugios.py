# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from typing import List

from app.db.database import get_db
from app.core.security import get_current_refugio
from app.models.usuario import Usuario
from app.models.refugio import Refugio
from app.schemas.refugio import RefugioResponse, RefugioUpdate

router = APIRouter()


@router.get("/", response_model=List[RefugioResponse])
def listar_refugios(db: Session = Depends(get_db)):
    return db.query(Refugio).order_by(Refugio.nombre.asc()).all()


@router.get("/mi-perfil", response_model=RefugioResponse)
def mi_perfil(current_user: Usuario = Depends(get_current_refugio), db: Session = Depends(get_db)):
    refugio = db.query(Refugio).filter(Refugio.usuario_id == current_user.id).first()
    if not refugio:
        raise HTTPException(status_code=404, detail="Refugio no encontrado")
    return refugio


@router.put("/mi-perfil", response_model=RefugioResponse)
def actualizar_perfil(
    payload: RefugioUpdate,
    current_user: Usuario = Depends(get_current_refugio),
    db: Session = Depends(get_db),
):
    refugio = db.query(Refugio).filter(Refugio.usuario_id == current_user.id).first()
    if not refugio:
        raise HTTPException(status_code=404, detail="Refugio no encontrado")
    for campo, valor in payload.model_dump(exclude_unset=True).items():
        setattr(refugio, campo, valor)
    db.commit()
    db.refresh(refugio)
    return refugio


@router.get("/{refugio_id}", response_model=RefugioResponse)
def obtener_refugio(refugio_id: int, db: Session = Depends(get_db)):
    refugio = db.query(Refugio).filter(Refugio.id == refugio_id).first()
    if not refugio:
        raise HTTPException(status_code=404, detail="Refugio no encontrado")
    return refugio
