// dashboard/src/services/subCategories.service.js
import { apiClient } from "../lib/apiClient.js";

// admin list
export async function fetchSubCategories(params = {}) {
  const qs = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 200),
    q: params.q ?? "",
    parent: params.parent ?? "",
  }).toString();

  const res = await apiClient.get(`/admin/subcategories?${qs}`, { auth: true });
  return res?.data ?? res; // { total,page,limit,data }
}
