// src/lib/apiClient.js
// Fetch-based client with axios-like helpers (get/post/patch/delete) for minimal UI changes.

const BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:4000/api/v1";

export function getToken() {
  return localStorage.getItem("accessToken");
}

async function request(
  path,
  { method = "GET", body, auth = false, headers = {} } = {}
) {
  const h = { ...headers };

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  // Only set JSON content-type when not sending FormData
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

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
}

// function-call style
export const apiClient = request;

// axios-like helpers (return { data } so existing code that uses res.data keeps working)
apiClient.get = (path, opts = {}) =>
  request(path, { ...opts, method: "GET" }).then((data) => ({ data }));

apiClient.post = (path, body, opts = {}) =>
  request(path, { ...opts, method: "POST", body }).then((data) => ({ data }));

apiClient.patch = (path, body, opts = {}) =>
  request(path, { ...opts, method: "PATCH", body }).then((data) => ({ data }));

apiClient.delete = (path, opts = {}) =>
  request(path, { ...opts, method: "DELETE" }).then((data) => ({ data }));

// Back-compat named export used in some files
export const api = apiClient;
