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
  if (Array.isArray(res?.data)) return { items: res.data, meta: { total: res.total, page: res.page, limit: res.limit } };
  return { items: [], meta: {} };
}

export async function fetchProducts(params = {}) {
  const res = await apiClient.get(`/admin/products${qs(params)}`, { auth: true });
  return normalizeListResponse(res?.data ?? res);
}

export async function fetchProductById(id) {
  const res = await apiClient.get(`/admin/products/${id}`, { auth: true });
  return res?.data ?? res;
}

export async function createProduct(body) {
  const res = await apiClient.post(`/admin/products`, body, { auth: true });
  return res?.data ?? res;
}

export async function updateProduct(id, body) {
  const res = await apiClient.patch(`/admin/products/${id}`, body, { auth: true });
  return res?.data ?? res;
}

export async function deleteProduct(id) {
  const res = await apiClient.delete(`/admin/products/${id}`, { auth: true });
  return res?.data ?? res;
}
