// dashboard/src/lib/apiClient.js
const BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:4000/api/v1";

export function getToken() {
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

function clearAuthStorage() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("adminUser");
}

export async function apiClient(
  path,
  { method = "GET", body, auth = false, headers = {} } = {}
) {
  const h = { ...headers };

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  // فقط وقتی FormData نیست، JSON header ست کن
  if (!isFormData && !h["Content-Type"]) h["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (token) h.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: h,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  // بعضی پاسخ‌ها ممکنه body نداشته باشن
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // اگر 401 شد، توکن‌های خراب/قدیمی رو پاک کن تا گیر نکنه
    if (res.status === 401) clearAuthStorage();

    const msg =
      data?.message ||
      data?.error ||
      data?.msg ||
      `HTTP ${res.status} ${res.statusText || ""}`.trim();
    throw new Error(msg);
  }

  return data;
}

// axios-like helpers (برای اینکه api.get/post... ارور نده)
apiClient.get = (path, opts = {}) =>
  apiClient(path, { ...opts, method: "GET" }).then((data) => ({ data }));

apiClient.post = (path, body, opts = {}) =>
  apiClient(path, { ...opts, method: "POST", body }).then((data) => ({ data }));

apiClient.patch = (path, body, opts = {}) =>
  apiClient(path, { ...opts, method: "PATCH", body }).then((data) => ({ data }));

apiClient.delete = (path, opts = {}) =>
  apiClient(path, { ...opts, method: "DELETE" }).then((data) => ({ data }));

// اگر یه جاهایی هنوز api می‌خوان:
export const api = apiClient;
