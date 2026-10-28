// src/utils/auth.js
const TOKEN_KEYS = ["authToken", "adminToken", "userToken", "token"];

// AUTO-LOGOUT 15 MINUTOS
let logoutTimer = null;
const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutos

export function logout() {
  clearAuth();
  // Dispara un evento global para que App.jsx navegue a /login
  window.dispatchEvent(new Event("logout"));
}

function resetInactivityTimer() {
  if (logoutTimer) clearTimeout(logoutTimer);

  logoutTimer = setTimeout(() => {
    logout();
  }, INACTIVITY_LIMIT);
}

export function initAutoLogout() {
  // Eventos que reinician el temporizador
  const eventos = ["click", "mousemove", "keydown", "scroll", "touchstart", "focus"];
  eventos.forEach((ev) => window.addEventListener(ev, resetInactivityTimer));

  // Detecta cambio de visibilidad (cuando la pestaña vuelve a estar activa)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") resetInactivityTimer();
  });

  // Revisa cada 5s para asegurarse de que el temporizador sigue activo
  setInterval(() => {
    if (!logoutTimer) resetInactivityTimer();
  }, 5000);

  resetInactivityTimer(); // inicia el conteo
}
export function getAuth() {
  for (const k of TOKEN_KEYS) {
    const v = localStorage.getItem(k) || sessionStorage.getItem(k);
    if (v) return { token: v };
  }

  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (userStr) return { user: JSON.parse(userStr) };

  return null;
}

export function setAuth({ token, user, persist = true }) {
  const storage = persist ? localStorage : sessionStorage;

  if (token) storage.setItem("authToken", token);
  if (user) storage.setItem("user", JSON.stringify(user));

  window.dispatchEvent(new Event("auth-changed"));
  resetInactivityTimer();
}

export function clearAuth() {
  const keys = ["authToken", "adminToken", "userToken", "token", "user"];
  keys.forEach((k) => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });

  window.dispatchEvent(new Event("auth-changed"));
  logoutTimer = null;
}
