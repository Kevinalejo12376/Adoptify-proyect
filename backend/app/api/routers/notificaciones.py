"""Notificaciones del usuario autenticado (sirve para usuario, refugio y admin)."""
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.security import get_current_user
from app.models.usuario import Usuario
from app.models.soporte import Notificacion

router = APIRouter()


def _serialize(n: Notificacion) -> dict:
    return {
        "id": n.id,
        "tipo": n.tipo,
        "mensaje": n.mensaje,
        "enlace": n.enlace,
        "leida": n.leida,
        "creado_en": n.creado_en.isoformat() if n.creado_en else None,
    }


@router.get("/")
def listar(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    notifs = (
        db.query(Notificacion)
        .filter(Notificacion.usuario_id == current_user.id)
        .order_by(Notificacion.creado_en.desc())
        .limit(50)
        .all()
    )
    return [_serialize(n) for n in notifs]


@router.get("/no-leidas")
def no_leidas(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    total = (
        db.query(Notificacion)
        .filter(Notificacion.usuario_id == current_user.id, Notificacion.leida == False)  # noqa: E712
        .count()
    )
    return {"count": total}


@router.patch("/{notif_id}/leer")
def marcar_leida(notif_id: int, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    n = db.query(Notificacion).filter(
        Notificacion.id == notif_id, Notificacion.usuario_id == current_user.id
    ).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notificacion no encontrada")
    n.leida = True
    db.commit()
    return {"ok": True}


@router.patch("/leer-todas")
def marcar_todas(current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(Notificacion).filter(
        Notificacion.usuario_id == current_user.id, Notificacion.leida == False  # noqa: E712
    ).update({Notificacion.leida: True})
    db.commit()
    return {"ok": True}


@router.delete("/{notif_id}")
def eliminar_notificacion(notif_id: int, current_user: Usuario = Depends(get_current_user), db: Session = Depends(get_db)):
    n = db.query(Notificacion).filter(
        Notificacion.id == notif_id, Notificacion.usuario_id == current_user.id
    ).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notificacion no encontrada")
    db.delete(n)
    db.commit()
    return {"ok": True}
