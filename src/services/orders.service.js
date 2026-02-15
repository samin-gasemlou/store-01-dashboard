// dashboard/src/services/orders.service.js
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
  // بک ممکنه:
  // 1) مستقیم آرایه بده
  // 2) {items:[...], total,...}
  // 3) {data:[...]}
  if (Array.isArray(res)) return { items: res, meta: {} };
  if (Array.isArray(res?.items)) return { items: res.items, meta: { total: res.total } };
  if (Array.isArray(res?.data)) return { items: res.data, meta: {} };
  return { items: [], meta: {} };
}

export async function fetchOrders(params = {}) {
  const res = await apiClient(`/admin/orders${qs(params)}`, {
    method: "GET",
    auth: true,
  });
  return normalizeListResponse(res);
}

export async function fetchOrderById(id) {
  return apiClient(`/admin/orders/${id}`, { method: "GET", auth: true });
}

// (اختیاری) اگر بعداً خواستی وضعیت سفارش عوض کنی:
export async function changeOrderStatus(id, { status, note = "" }) {
  return apiClient(`/admin/orders/${id}/status`, {
    method: "PATCH",
    auth: true,
    body: { status, note },
  });
}
