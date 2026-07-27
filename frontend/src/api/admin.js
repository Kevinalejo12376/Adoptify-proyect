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

/** Lista todos los productos (con su vendedor). */
export async function listarProductos() {
  return apiFetch(`${base}/productos`);
}

/** Elimina un producto. */
export async function eliminarProducto(id) {
  return apiFetch(`${base}/productos/${id}`, { method: "DELETE" });
}

// ===== PQRS =====
export async function listarPqrs() { return apiFetch(`${base}/pqrs`); }
export async function actualizarPqrs(id, payload) {
  return apiFetch(`${base}/pqrs/${id}`, { method: "PATCH", body: payload });
}

// ===== Reportes =====
export async function listarReportes() { return apiFetch(`${base}/reportes`); }
export async function actualizarReporte(id, payload) {
  return apiFetch(`${base}/reportes/${id}`, { method: "PATCH", body: payload });
}

// ===== Pedidos =====
export async function listarPedidos() { return apiFetch(`${base}/pedidos`); }

// ===== Foro =====
export async function listarForoAdmin() { return apiFetch(`${base}/foro`); }
export async function eliminarPostAdmin(id) {
  return apiFetch(`${base}/foro/${id}`, { method: "DELETE" });
}

// ===== Auditoría =====
export async function listarAuditoria() { return apiFetch(`${base}/auditoria`); }
