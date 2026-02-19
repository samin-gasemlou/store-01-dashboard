import { apiClient } from "../lib/apiClient.js";

// admin list
export async function fetchCategories(params = {}) {
  const qs = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 200),
    q: params.q ?? "",
  }).toString();

  const res = await apiClient.get(`/admin/categories?${qs}`, { auth: true });
  return res?.data ?? res; // { total,page,limit,data }
}

export async function createCategory(body) {
  const res = await apiClient.post(`/admin/categories`, body, { auth: true });
  return res?.data ?? res;
}

export async function updateCategory(id, body) {
  const res = await apiClient.patch(`/admin/categories/${id}`, body, { auth: true });
  return res?.data ?? res;
}

export async function deleteCategory(id) {
  const res = await apiClient.delete(`/admin/categories/${id}`, { auth: true });
  return res?.data ?? res;
}
