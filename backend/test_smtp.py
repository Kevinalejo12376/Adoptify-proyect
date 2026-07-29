"""
Script de prueba para verificar la conexion SMTP de Gmail.
Lee la configuracion del archivo .env automáticamente.
Uso: python test_smtp.py <email_destino>
Ejemplo: python test_smtp.py programadoreder0@gmail.com
"""
import sys
import os
import smtplib
import logging
from email.mime.text import MIMEText

logging.basicConfig(level=logging.DEBUG)

# Cargar variables del .env (simple, sin librerias externas)
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                val = val.strip().strip("\"'")
                os.environ[key.strip()] = val

SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_FROM = os.environ.get("SMTP_FROM", SMTP_USER)

if len(sys.argv) < 2:
    print("ERROR: Uso: python test_smtp.py <email_destino>")
    print("  Ejemplo: python test_smtp.py programadoreder0@gmail.com")
    sys.exit(1)

EMAIL_DESTINO = sys.argv[1].strip()

print("Probando SMTP...")
print("  Host: %s:%s" % (SMTP_HOST, SMTP_PORT))
print("  User: %s" % SMTP_USER)
print("  From: %s" % SMTP_FROM)
print("  To:   %s" % EMAIL_DESTINO)
print()

try:
    msg = MIMEText(
        "Este es un correo de prueba para verificar que SMTP funciona correctamente.\n\n"
        "Si recibes esto, el problema no es de conexion SMTP.",
        "plain",
    )
    msg["From"] = SMTP_FROM
    msg["To"] = EMAIL_DESTINO
    msg["Subject"] = "Prueba SMTP - Adoptify"

    print("Conectando al servidor SMTP...")
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as server:
        server.set_debuglevel(1)
        print("Iniciando TLS...")
        server.starttls()
        print("Iniciando sesion...")
        server.login(SMTP_USER, SMTP_PASSWORD)
        print("Enviando correo...")
        server.sendmail(SMTP_FROM, EMAIL_DESTINO, msg.as_string())

    print()
    print("EXITO: Correo de prueba enviado exitosamente!")
    print("Revisa tu bandeja de entrada (y tambien SPAM).")

except smtplib.SMTPAuthenticationError:
    print()
    print("ERROR DE AUTENTICACION SMTP")
    print("La contrasena de aplicacion para %s es INCORRECTA o fue revocada." % SMTP_USER)
    print()
    print("Solucion: Genera una nueva contrasena de aplicacion en:")
    print("https://myaccount.google.com/apppasswords")
    print()
    print("Pasos:")
    print("1. Ve a https://myaccount.google.com/security")
    print("2. Activa 'Verificacion en 2 pasos' si no esta activada")
    print("3. Ve a 'Contrasenas de aplicaciones'")
    print("4. Genera una nueva contrasena para 'Correo'")
    print("5. Copia la contrasena de 16 letras y pegala en backend/.env como SMTP_PASSWORD")

except smtplib.SMTPException as e:
    print()
    print("Error SMTP: %s" % e)
except Exception as e:
    print()
    print("Error inesperado: %s" % e)
