// Llamadas al backend para productos (marketplace publico + gestion).
import { apiFetch } from "./client";

const base = "/api/productos";

/** Listado publico de productos. filtros: { categoria } (opcional). */
export async function listarProductos(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.categoria) params.set("categoria", filtros.categoria);
  const q = params.toString();
  return apiFetch(`${base}/${q ? `?${q}` : ""}`, { auth: false });
}

/** Detalle publico de un producto. */
export const obtenerProducto = (id) => apiFetch(`${base}/${id}`, { auth: false });

/** Productos de la tienda/refugio autenticado. */
export const misProductos = () => apiFetch(`${base}/mios`);

/** Crea un producto. */
export const crearProducto = (payload) =>
  apiFetch(`${base}/`, { method: "POST", body: payload });

/** Actualiza un producto. */
export const actualizarProducto = (id, payload) =>
  apiFetch(`${base}/${id}`, { method: "PUT", body: payload });

/** Elimina un producto. */
export const eliminarProducto = (id) => apiFetch(`${base}/${id}`, { method: "DELETE" });
