# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, func
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship
from app.db.database import Base


class Refugio(Base):
    __tablename__ = "refugios"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), unique=True, nullable=False)
    nombre = Column(String(150), nullable=False)
    slug = Column(String(160), unique=True)
    descripcion = Column(Text)
    ubicacion = Column(String(150))
    direccion = Column(String(200))
    telefono = Column(String(30))
    email = Column(String(255))
    facebook = Column(String(120))
    instagram = Column(String(120))
    tienda_habilitada = Column(Boolean, nullable=False, default=False)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("Usuario", back_populates="refugio")
    mascotas = relationship("Mascota", back_populates="refugio", cascade="all, delete-orphan")
