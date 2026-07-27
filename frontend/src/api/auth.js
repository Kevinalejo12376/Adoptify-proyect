// Llamadas de autenticacion al backend FastAPI.
import { apiFetch, setToken, clearToken } from "./client";

/** Registra un nuevo usuario o refugio. Devuelve el usuario creado. */
export async function registerRequest(payload) {
  // payload: { nombre, apellido, email, password, telefono, tipo_documento,
  //            numero_documento, rol, ubicacion, nombre_refugio }
  return apiFetch("/api/auth/register", { method: "POST", body: payload, auth: false });
}

/** Inicia sesion. Guarda el token y devuelve el usuario (via /me). */
export async function loginRequest(email, password) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: { username: email, password },
    auth: false,
    form: true,
  });
  setToken(data.access_token);
  return fetchMe();
}

/** Obtiene el usuario autenticado. */
export async function fetchMe() {
  return apiFetch("/api/auth/me", { method: "GET" });
}

/** Obtiene el perfil completo del usuario autenticado. */
export async function fetchProfile() {
  return apiFetch("/api/auth/profile", { method: "GET" });
}

/** Actualiza los datos del perfil del usuario autenticado. */
export async function updateProfile(payload) {
  return apiFetch("/api/auth/profile", { method: "PUT", body: payload });
}

/** Inicia sesion con Google. Envia el credential token al backend. */
export async function googleLoginRequest(credential) {
  const data = await apiFetch("/api/auth/google", {
    method: "POST",
    body: { credential },
    auth: false,
  });
  setToken(data.access_token);
  return fetchMe();
}

/** Cierra sesion (limpia el token local). */
export function logoutRequest() {
  clearToken();
}
