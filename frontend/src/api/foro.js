// Llamadas al backend para el foro / comunidad.
import { apiFetch } from "./client";

const base = "/api/foro";

/** Lista publicaciones del foro. categoria opcional (codigo o 'all'). */
export async function listarPosts(categoria) {
  const q = categoria && categoria !== "all" ? `?categoria=${encodeURIComponent(categoria)}` : "";
  return apiFetch(`${base}/posts${q}`, { auth: false });
}

/** Detalle de una publicacion (incluye comentarios). */
export const obtenerPost = (id) => apiFetch(`${base}/posts/${id}`, { auth: false });

/** Crea una publicacion (requiere sesion). */
export const crearPost = (payload) =>
  apiFetch(`${base}/posts`, { method: "POST", body: payload });

/** Agrega un comentario a una publicacion. */
export const comentar = (postId, payload) =>
  apiFetch(`${base}/posts/${postId}/comentarios`, { method: "POST", body: payload });

/** Alterna una reaccion en una publicacion (toggle). */
export const reaccionar = (postId, tipo = "like") =>
  apiFetch(`${base}/posts/${postId}/reacciones`, { method: "POST", body: { tipo } });
