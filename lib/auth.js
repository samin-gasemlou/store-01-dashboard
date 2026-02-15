// src/lib/auth.js
import { apiClient } from "./apiClient.js";

export async function adminLogin({ email, password }) {
  const data = await apiClient("/admin/auth/login", {
    method: "POST",
    body: { email, password },
  });

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("adminUser", JSON.stringify(data.user || {}));

  return data.user;
}

export async function adminRegister({ name, email, password, role }) {
  return apiClient("/admin/auth/register", {
    method: "POST",
    body: { name, email, password, role },
  });
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("adminUser");
}

export function isAuthed() {
  return !!localStorage.getItem("accessToken");
}

export function getAdminUser() {
  try {
    return JSON.parse(localStorage.getItem("adminUser") || "{}");
  } catch {
    return {};
  }
}
