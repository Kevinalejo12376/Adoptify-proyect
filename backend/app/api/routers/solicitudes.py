# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from typing import List

from app.db.database import get_db
from app.core.security import get_current_user, get_current_refugio
from app.core.lookups import id_por_codigo
from app.models.usuario import Usuario
from app.models.refugio import Refugio
from app.models.mascota import Mascota
from app.models.solicitud import SolicitudAdopcion
from app.models.catalogos import EstadoSolicitud
from app.schemas.solicitud import SolicitudCreate, SolicitudResponse, SolicitudEstadoUpdate
from app.schemas.serializers import serialize_solicitud

router = APIRouter()


@router.post("/", response_model=SolicitudResponse, status_code=status.HTTP_201_CREATED)
def crear_solicitud(
    payload: SolicitudCreate,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    mascota = db.query(Mascota).filter(Mascota.id == payload.mascota_id).first()
    if not mascota:
        raise HTTPException(status_code=404, detail="Mascota no encontrada")

    estado_id = id_por_codigo(db, EstadoSolicitud, "pendiente", requerido=True)
    solicitud = SolicitudAdopcion(
        mascota_id=payload.mascota_id,
        usuario_id=current_user.id,
        estado_id=estado_id,
        nombre_contacto=payload.nombre_contacto,
        email_contacto=payload.email_contacto,
        telefono_contacto=payload.telefono_contacto,
        ubicacion=payload.ubicacion,
        mensaje=payload.mensaje,
        tiene_familia=payload.tiene_familia,
        tiene_experiencia=payload.tiene_experiencia,
    )
    db.add(solicitud)
    db.commit()
    db.refresh(solicitud)
    return serialize_solicitud(solicitud)


@router.get("/mias", response_model=List[SolicitudResponse])
def mis_solicitudes(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    solicitudes = (
        db.query(SolicitudAdopcion)
        .filter(SolicitudAdopcion.usuario_id == current_user.id)
        .order_by(SolicitudAdopcion.creada_en.desc())
        .all()
    )
    return [serialize_solicitud(s) for s in solicitudes]


@router.get("/recibidas", response_model=List[SolicitudResponse])
def solicitudes_recibidas(current_user: Usuario = Depends(get_current_refugio), db: Session = Depends(get_db)):
    refugio = db.query(Refugio).filter(Refugio.usuario_id == current_user.id).first()
    if not refugio:
        raise HTTPException(status_code=404, detail="Refugio no encontrado")
    solicitudes = (
        db.query(SolicitudAdopcion)
        .join(Mascota, SolicitudAdopcion.mascota_id == Mascota.id)
        .filter(Mascota.refugio_id == refugio.id)
        .order_by(SolicitudAdopcion.creada_en.desc())
        .all()
    )
    return [serialize_solicitud(s) for s in solicitudes]


@router.patch("/{solicitud_id}/estado", response_model=SolicitudResponse)
def actualizar_estado(
    solicitud_id: int,
    payload: SolicitudEstadoUpdate,
    current_user: Usuario = Depends(get_current_refugio),
    db: Session = Depends(get_db),
):
    nuevo_estado_id = id_por_codigo(db, EstadoSolicitud, payload.estado, requerido=True)
    refugio = db.query(Refugio).filter(Refugio.usuario_id == current_user.id).first()
    solicitud = db.query(SolicitudAdopcion).filter(SolicitudAdopcion.id == solicitud_id).first()
    if not solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    mascota = db.query(Mascota).filter(Mascota.id == solicitud.mascota_id).first()
    if not refugio or not mascota or mascota.refugio_id != refugio.id:
        raise HTTPException(status_code=403, detail="No puedes gestionar esta solicitud")
    solicitud.estado_id = nuevo_estado_id
    db.commit()
    db.refresh(solicitud)
    return serialize_solicitud(solicitud)
