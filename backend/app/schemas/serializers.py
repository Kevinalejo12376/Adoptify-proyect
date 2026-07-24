"""Convierte objetos ORM (con FKs a catalogos) en diccionarios legibles para la API."""


def serialize_usuario(u):
    return {
        "id": u.id,
        "nombre": u.nombre,
        "apellido": u.apellido,
        "email": u.email,
        "telefono": u.telefono,
        "numero_documento": u.numero_documento,
        "ubicacion": u.ubicacion,
        "rol": u.rol.codigo if u.rol else None,
        "tipo_documento": u.tipo_documento.codigo if u.tipo_documento else None,
        "perfil_completo": u.perfil_completo if hasattr(u, "perfil_completo") else False,
    }


def serialize_mascota(m):
    return {
        "id": m.id,
        "refugio_id": m.refugio_id,
        "nombre": m.nombre,
        "raza": m.raza,
        "edad": m.edad,
        "peso": m.peso,
        "color": m.color,
        "descripcion": m.descripcion,
        "personalidad": m.personalidad,
        "salud": m.salud,
        "requisitos": m.requisitos,
        "vacunado": m.vacunado,
        "esterilizado": m.esterilizado,
        "desparasitado": m.desparasitado,
        # Etiquetas legibles (nombre) + ids por si el frontend los necesita
        "tipo": m.tipo.nombre if m.tipo else None,
        "tamano": m.tamano.nombre if m.tamano else None,
        "genero": m.genero.nombre if m.genero else None,
        "estado": m.estado.codigo if m.estado else None,
        "tipo_id": m.tipo_id,
        "tamano_id": m.tamano_id,
        "genero_id": m.genero_id,
        "estado_id": m.estado_id,
    }


def serialize_solicitud(s):
    return {
        "id": s.id,
        "mascota_id": s.mascota_id,
        "usuario_id": s.usuario_id,
        "nombre_contacto": s.nombre_contacto,
        "email_contacto": s.email_contacto,
        "telefono_contacto": s.telefono_contacto,
        "ubicacion": s.ubicacion,
        "mensaje": s.mensaje,
        "notas": s.notas,
        "tiene_familia": s.tiene_familia,
        "tiene_experiencia": s.tiene_experiencia,
        "progreso": s.progreso,
        "estado": s.estado.codigo if s.estado else None,
        "estado_id": s.estado_id,
    }


def serialize_producto(p):
    return {
        "id": p.id,
        "nombre": p.nombre,
        "precio": float(p.precio) if p.precio is not None else 0,
        "descripcion": p.descripcion,
        "descripcion_larga": p.descripcion_larga,
        "calidad": p.calidad,
        "stock": p.stock,
        "marca": p.marca,
        "material": p.material,
        "tallas": p.tallas,
        "colores": p.colores,
        "activo": p.activo,
        "ventas": p.ventas,
        "rating": float(p.rating) if p.rating is not None else 0,
        "categoria": p.categoria.nombre if p.categoria else None,
        "categoria_id": p.categoria_id,
        "refugio_id": p.refugio_id,
        "tienda_id": p.tienda_id,
    }
