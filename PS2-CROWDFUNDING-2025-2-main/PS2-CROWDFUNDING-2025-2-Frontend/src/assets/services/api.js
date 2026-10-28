// src/assets/services/api.js
const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

/* ---------------- FUNCION REQUEST GENERAL ---------------- */
async function request(path, { method = "GET", data, headers } = {}) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json", ...(headers || {}) },
  };

  if (data !== undefined) opts.body = JSON.stringify(data);

  try {
    const res = await fetch(`${BASE_URL}${path}`, opts);
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const msg =
        (isJson && (payload?.message || payload?.error)) ||
        res.statusText ||
        "Error en la API";
      return { success: false, message: msg };
    }

    // ✅ Si el payload es un array, devuélvelo directamente
    return Array.isArray(payload?.data) ? payload.data : { success: true, ...payload };
  } catch (err) {
    console.error("❌ Error al conectar API:", err);
    return { success: false, message: "No se pudo conectar al servidor" };
  }
}

/* ---------------- USERS API ---------------- */
export const getUsers = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/users${qs ? `?${qs}` : ""}`);
};

export const getUser = (id) => request(`/api/users/${id}`);

export const createUser = (user) =>
  request(`/api/users`, { method: "POST", data: user });

export const updateUser = (id, user) =>
  request(`/api/users/${id}`, { method: "PUT", data: user });

export const softDeleteUser = (id) =>
  request(`/api/users/${id}`, { method: "DELETE" });

export const restoreUser = (id) =>
  request(`/api/users/${id}/restore`, { method: "PATCH" });

/* ---------------- HEALTHCHECK ---------------- */
export const ping = () => request(`/`);
