"""
Verifica la conexion a la base de datos (Supabase o SQLite).
Uso (desde la carpeta backend/):
    venv\\Scripts\\python.exe test_conexion.py
"""
from sqlalchemy import text
from app.db.database import engine
from app.core.config import settings


def main():
    # Muestra a que motor apunta (oculta la contrasena).
    url = settings.DATABASE_URL
    if "@" in url:
        # Oculta credenciales para no imprimir la contrasena.
        inicio = url.split("://")[0]
        resto = url.split("@")[-1]
        print(f"Conectando a: {inicio}://***@{resto}")
    else:
        print(f"Conectando a: {url}")

    try:
        with engine.connect() as conn:
            version = conn.execute(text("SELECT version();")).scalar()
            print("CONEXION OK")
            print("Motor:", version)

            # Lista las tablas creadas (solo Postgres).
            if url.startswith("postgresql"):
                filas = conn.execute(text(
                    "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;"
                )).fetchall()
                print(f"\nTablas encontradas ({len(filas)}):")
                for (t,) in filas:
                    print("  -", t)
    except Exception as e:
        print("ERROR DE CONEXION:")
        print(type(e).__name__, "->", e)


if __name__ == "__main__":
    main()
