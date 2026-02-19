import { apiClient } from "../lib/apiClient.js";

export async function listPromoCodes() {
  return apiClient(`/admin/promocodes`, { method: "GET", auth: true });
}

export async function createPromoCode(payload) {
  return apiClient(`/admin/promocodes`, { method: "POST", auth: true, body: payload });
}

export async function updatePromoCode(id, payload) {
  return apiClient(`/admin/promocodes/${id}`, { method: "PATCH", auth: true, body: payload });
}

export async function deletePromoCode(id) {
  return apiClient(`/admin/promocodes/${id}`, { method: "DELETE", auth: true });
}
