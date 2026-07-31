# pyrefly: ignore [missing-import]
import logging
from contextlib import asynccontextmanager
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, Request
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from fastapi.responses import JSONResponse
# pyrefly: ignore [missing-import]
from sqlalchemy.exc import SQLAlchemyError
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

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crea las tablas (dev/SQLite) y puebla los catalogos (idempotente).
    # En Supabase las tablas ya existen via supabase_schema.sql.
    try:
        Base.metadata.create_all(bind=engine)
        # Migracion: agrega columnas faltantes en Supabase si es necesario
        _run_migrations()
        seed_catalogos()
        logger.info("[lifespan] Conexion a base de datos OK (tablas listas).")
    except Exception as exc:
        # No bloquea el arranque: en Supabase las tablas ya existen.
        logger.warning(
            "[lifespan] No se pudieron crear/sembrar tablas (afecta solo a SQLite local). "
            "En Supabase las tablas ya existen, el servidor igual arranca. Detalle: %s",
            exc,
        )
        logger.warning(
            "[lifespan] Si ves 'could not translate host name' o 'timeout expired', "
            "revisa tu conexion de red/DNS (VPN o firewall) hacia Supabase."
        )
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


# Maneja errores de base de datos (conexion caida, DNS no resuelve, timeout)
# devolviendo un JSON 503 limpio en lugar de un stack trace gigante en consola.
@app.exception_handler(SQLAlchemyError)
async def _db_error_handler(request: Request, exc: SQLAlchemyError):
    logger.error("Error de base de datos en %s: %s", request.url.path, exc)
    return JSONResponse(
        status_code=503,
        content={
            "detail": (
                "La base de datos no esta disponible en este momento. "
                "Revisa tu conexion de red/DNS hacia Supabase e intentalo de nuevo."
            )
        },
    )


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
app.include_router(publico.router, prefix="/api/publico", tags=["Publico"])
app.include_router(configuraciones.router, prefix="/api/configuraciones", tags=["Configuraciones"])
app.include_router(favoritos.router, prefix="/api/favoritos", tags=["Favoritos"])
app.include_router(foro.router, prefix="/api/foro", tags=["Foro"])
app.include_router(tienda.router, prefix="/api/tienda", tags=["Tienda (self-service)"])
app.include_router(pedidos.router, prefix="/api/pedidos", tags=["Pedidos"])


@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Adoptify"}
