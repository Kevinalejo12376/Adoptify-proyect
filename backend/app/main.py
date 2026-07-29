# pyrefly: ignore [missing-import]
import os
from contextlib import asynccontextmanager
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.db.database import Base, engine
# Importa todos los modelos para registrarlos en Base.metadata
from app import models  # noqa: F401
from app.db.seed import seed_catalogos
from app.api.routers import (
    auth, mascotas, refugios, solicitudes, productos, catalogos, admin,
    notificaciones, pqrs, reportes, publico, configuraciones, favoritos, foro,
    tienda, pedidos,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crea las tablas (dev/SQLite) y puebla los catalogos (idempotente).
    # En Supabase las tablas ya existen via supabase_schema.sql.
    try:
        Base.metadata.create_all(bind=engine)
        # Migracion: agrega columnas faltantes en Supabase si es necesario
        _run_migrations()
        seed_catalogos()
    except Exception as exc:
        print(f"[lifespan] Advertencia: no se pudieron crear/sembrar tablas: {exc}")
        print("[lifespan] En Supabase las tablas ya existen; el servidor igual puede funcionar.")
    yield


def _run_migrations():
    """Ejecuta migraciones para sincronizar el schema de Supabase con los modelos."""
    from app.db.database import SessionLocal
    from sqlalchemy import text
    db = SessionLocal()
    try:
        # Verifica si la columna 'perfil_completo' existe en usuarios
        result = db.execute(text(
            "SELECT 1 FROM information_schema.columns "
            "WHERE table_name='usuarios' AND column_name='perfil_completo'"
        )).fetchone()
        if not result:
            print("[migracion] Agregando columna 'perfil_completo' a usuarios...")
            db.execute(text(
                "ALTER TABLE usuarios ADD COLUMN perfil_completo BOOLEAN NOT NULL DEFAULT false"
            ))
            db.commit()
            print("[migracion] Columna 'perfil_completo' agregada correctamente.")
    except Exception as e:
        print(f"[migracion] Error ejecutando migraciones: {e}")
    finally:
        db.close()


app = FastAPI(title="Adoptify API", lifespan=lifespan)

# CORS para permitir que el frontend de React se comunique con la API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins,
    allow_credentials=settings.allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir archivos estáticos (uploads de imágenes)
uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

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
app.include_router(publico.router, prefix="/api/publico", tags=["Publico"])
app.include_router(configuraciones.router, prefix="/api/configuraciones", tags=["Configuraciones"])
app.include_router(favoritos.router, prefix="/api/favoritos", tags=["Favoritos"])
app.include_router(foro.router, prefix="/api/foro", tags=["Foro"])
app.include_router(tienda.router, prefix="/api/tienda", tags=["Tienda (self-service)"])
app.include_router(pedidos.router, prefix="/api/pedidos", tags=["Pedidos"])


@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Adoptify"}
