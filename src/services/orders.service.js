import { apiClient } from "../lib/apiClient.js";

function qs(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v).trim();
    if (!s) return;
    sp.set(k, s);
  });
  const query = sp.toString();
  return query ? `?${query}` : "";
}

// بک شما: { total,page,limit,data }
function normalizeListResponse(res) {
  if (!res) return { items: [], meta: {} };

  if (Array.isArray(res)) {
    return { items: res, meta: { total: res.length } };
  }

  if (Array.isArray(res.data)) {
    return {
      items: res.data,
      meta: {
        total: Number(res.total ?? res.data.length ?? 0),
        page: Number(res.page ?? 1),
        limit: Number(res.limit ?? res.data.length ?? 0),
      },
    };
  }

  if (Array.isArray(res.items)) {
    return {
      items: res.items,
      meta: {
        total: Number(res.total ?? res.items.length ?? 0),
        page: Number(res.page ?? 1),
        limit: Number(res.limit ?? res.items.length ?? 0),
      },
    };
  }

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
  if (!id) throw new Error("Order id is required");
  return apiClient(`/admin/orders/${id}`, { method: "GET", auth: true });
}

export async function changeOrderStatus(id, { status, note = "" } = {}) {
  if (!id) throw new Error("Order id is required");
  if (!status) throw new Error("Status is required");

  return apiClient(`/admin/orders/${id}/status`, {
    method: "PATCH",
    auth: true,
    body: { status: String(status).toUpperCase(), note },
  });
}

// ئەگەر هنوز روت DELETE نداری، فعلاً لە UI حذف نکن یان روتش رو اضافه کن
export async function deleteOrder(id) {
  if (!id) throw new Error("Order id is required");
  return apiClient(`/admin/orders/${id}`, { method: "DELETE", auth: true });
}
