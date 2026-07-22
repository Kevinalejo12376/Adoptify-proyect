// Llamadas al panel de administracion (requieren token de admin).
import { apiFetch } from "./client";

const base = "/api/admin";

/** Lista usuarios. rol opcional (codigo) para filtrar. */
export async function listarUsuarios(rol) {
  const q = rol ? `?rol=${encodeURIComponent(rol)}` : "";
  return apiFetch(`${base}/usuarios${q}`);
}

/** Crea un usuario/administrador/refugio. */
export async function crearUsuario(payload) {
  // payload: { nombre, apellido, email, password, telefono, tipo_documento,
  //            numero_documento, rol, ubicacion, nombre_refugio }
  return apiFetch(`${base}/usuarios`, { method: "POST", body: payload });
}

/** Actualiza un usuario (activo, datos basicos). */
export async function actualizarUsuario(id, payload) {
  return apiFetch(`${base}/usuarios/${id}`, { method: "PATCH", body: payload });
}

/** Elimina un usuario. */
export async function eliminarUsuario(id) {
  return apiFetch(`${base}/usuarios/${id}`, { method: "DELETE" });
}

/** Estadisticas reales (conteos) para el dashboard del admin. */
export async function getEstadisticas() {
  return apiFetch(`${base}/estadisticas`);
}

/** Lista todas las mascotas (de todos los refugios). */
export async function listarMascotas() {
  return apiFetch(`${base}/mascotas`);
}

/** Elimina una mascota. */
export async function eliminarMascota(id) {
  return apiFetch(`${base}/mascotas/${id}`, { method: "DELETE" });
}
