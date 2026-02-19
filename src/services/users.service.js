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

function normalizeListResponse(res) {
  if (!res) return { items: [], meta: {} };
  if (Array.isArray(res)) return { items: res, meta: { total: res.length } };
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

export async function fetchUsers(params = {}) {
  const res = await apiClient(`/admin/users${qs(params)}`, {
    method: "GET",
    auth: true,
  });
  return normalizeListResponse(res);
}

export async function fetchUserById(id) {
  if (!id) throw new Error("User id is required");
  return apiClient(`/admin/users/${id}`, { method: "GET", auth: true });
}

export async function fetchUserHistory(id, limit = 5) {
  if (!id) throw new Error("User id is required");
  return apiClient(`/admin/users/${id}/history?limit=${limit}`, { method: "GET", auth: true });
}

export async function updateUser(id, payload = {}) {
  if (!id) throw new Error("User id is required");
  return apiClient(`/admin/users/${id}`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });
}

export async function setUserBlocked(id, blocked) {
  if (!id) throw new Error("User id is required");
  return apiClient(`/admin/users/${id}/block`, {
    method: "PATCH",
    auth: true,
    body: { blocked: Boolean(blocked) },
  });
}

export async function deleteUser(id) {
  if (!id) throw new Error("User id is required");
  return apiClient(`/admin/users/${id}`, { method: "DELETE", auth: true });
}
