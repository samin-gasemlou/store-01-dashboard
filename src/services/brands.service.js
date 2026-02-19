// dashboard/src/services/brands.service.js
import { apiClient } from "../lib/apiClient.js";

function qs(params = {}) {
  const sp = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v).trim();
    if (!s) return;
    sp.set(k, s);
  });

  const q = sp.toString();
  return q ? `?${q}` : "";
}

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

export async function fetchBrands(params = {}) {
  const res = await apiClient(`/admin/brands${qs({
    page: params.page ?? 1,
    limit: params.limit ?? 200,
    q: params.q ?? "",
  })}`, {
    method: "GET",
    auth: true,
  });

  return normalizeListResponse(res?.data ?? res);
}

export async function createBrand(body) {
  const res = await apiClient("/admin/brands", {
    method: "POST",
    auth: true,
    body,
  });

  return res?.data ?? res;
}

export async function updateBrand(id, body) {
  if (!id) throw new Error("Brand id is required");

  const res = await apiClient(`/admin/brands/${id}`, {
    method: "PATCH",
    auth: true,
    body,
  });

  return res?.data ?? res;
}

export async function deleteBrand(id) {
  if (!id) throw new Error("Brand id is required");

  const res = await apiClient(`/admin/brands/${id}`, {
    method: "DELETE",
    auth: true,
  });

  return res?.data ?? res;
}
