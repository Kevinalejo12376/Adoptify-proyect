# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, func
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship
from app.db.database import Base


class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="SET NULL"))
    estado_id = Column(Integer, ForeignKey("estados_pedido.id"), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False, default=0)
    costo_envio = Column(Numeric(10, 2), nullable=False, default=0)
    descuento = Column(Numeric(10, 2), nullable=False, default=0)
    total = Column(Numeric(10, 2), nullable=False, default=0)
    codigo_promocion = Column(String(40))
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    estado = relationship("EstadoPedido", lazy="joined")
