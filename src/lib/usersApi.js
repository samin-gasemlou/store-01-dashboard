import { apiClient } from "./apiClient.js";

function qs(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// بک: { total, page, limit, data }
function normalizeListResponse(res) {
  if (!res) return { items: [], meta: {} };
  if (Array.isArray(res)) return { items: res, meta: { total: res.length } };
  if (Array.isArray(res?.data))
    return {
      items: res.data,
      meta: {
        total: Number(res.total ?? res.data.length ?? 0),
        page: Number(res.page ?? 1),
        limit: Number(res.limit ?? res.data.length ?? 0),
      },
    };
  if (Array.isArray(res?.items))
    return {
      items: res.items,
      meta: {
        total: Number(res.total ?? res.items.length ?? 0),
        page: Number(res.page ?? 1),
        limit: Number(res.limit ?? res.items.length ?? 0),
      },
    };
  return { items: [], meta: {} };
}

export async function fetchUsers(params = {}) {
  const res = await apiClient(`/admin/users${qs(params)}`, { method: "GET", auth: true });
  return normalizeListResponse(res);
}

export async function fetchUserById(id) {
  if (!id) throw new Error("User id is required");
  return apiClient(`/admin/users/${id}`, { method: "GET", auth: true });
}
