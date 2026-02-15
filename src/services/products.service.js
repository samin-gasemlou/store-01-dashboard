// dashboard/src/services/products.service.js
import { apiClient } from "../lib/apiClient.js";

function qs(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

function normalizeListResponse(res) {
  if (Array.isArray(res)) return { items: res, meta: {} };
  if (Array.isArray(res?.items)) return { items: res.items, meta: { total: res.total } };
  if (Array.isArray(res?.data)) return { items: res.data, meta: {} };
  return { items: [], meta: {} };
}

export async function fetchProducts(params = {}) {
  const res = await apiClient(`/admin/products${qs(params)}`, {
    method: "GET",
    auth: true,
  });
  return normalizeListResponse(res);
}

export async function fetchProductById(id) {
  return apiClient(`/admin/products/${id}`, { method: "GET", auth: true });
}

export async function createProduct(body) {
  return apiClient(`/admin/products`, { method: "POST", auth: true, body });
}

export async function updateProduct(id, body) {
  return apiClient(`/admin/products/${id}`, { method: "PATCH", auth: true, body });
}

export async function deleteProduct(id) {
  return apiClient(`/admin/products/${id}`, { method: "DELETE", auth: true });
}
