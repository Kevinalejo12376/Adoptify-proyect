# pyrefly: ignore [missing-import]
from contextlib import asynccontextmanager
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import Base, engine
# Importa todos los modelos para registrarlos en Base.metadata
from app import models  # noqa: F401
from app.db.seed import seed_catalogos
from app.api.routers import (
    auth, mascotas, refugios, solicitudes, productos, catalogos, admin,
    notificaciones, pqrs, reportes,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crea las tablas (dev/SQLite) y puebla los catalogos (idempotente).
    # En Supabase las tablas ya existen via supabase_schema.sql.
    Base.metadata.create_all(bind=engine)
    seed_catalogos()
    yield


app = FastAPI(title="Adoptify API", lifespan=lifespan)

# CORS para permitir que el frontend de React se comunique con la API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins,
    allow_credentials=settings.allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers (endpoints)
app.include_router(catalogos.router, prefix="/api/catalogos", tags=["Catalogos"])
app.include_router(auth.router, prefix="/api/auth", tags=["Autenticacion"])
app.include_router(admin.router, prefix="/api/admin", tags=["Administracion"])
app.include_router(mascotas.router, prefix="/api/mascotas", tags=["Mascotas"])
app.include_router(refugios.router, prefix="/api/refugios", tags=["Refugios"])
app.include_router(solicitudes.router, prefix="/api/solicitudes", tags=["Solicitudes"])
app.include_router(productos.router, prefix="/api/productos", tags=["Productos"])
app.include_router(notificaciones.router, prefix="/api/notificaciones", tags=["Notificaciones"])
app.include_router(pqrs.router, prefix="/api/pqrs", tags=["PQRS"])
app.include_router(reportes.router, prefix="/api/reportes", tags=["Reportes"])


@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Adoptify"}
