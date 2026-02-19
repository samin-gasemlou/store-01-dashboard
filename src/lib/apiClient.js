const BASE =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1").replace(/\/$/, "");

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

function normalizePath(path) {
  if (typeof path !== "string" || !path.trim()) {
    throw new Error(`apiClient: invalid path => ${String(path)}`);
  }
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

async function safeReadBody(res) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return res.json().catch(() => ({}));
  }
  // fallback text
  const txt = await res.text().catch(() => "");
  return { message: txt };
}

export async function apiClient(
  path,
  { method = "GET", body, auth = false, headers = {} } = {}
) {
  const url = `${BASE}${normalizePath(path)}`;

  const h = { ...headers };
  const upper = String(method || "GET").toUpperCase();

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  // ✅ فقط وقتی FormData نیست JSON header ست کن
  if (!isFormData && !h["Content-Type"] && upper !== "GET" && upper !== "HEAD") {
    h["Content-Type"] = "application/json";
  }

  // ✅ auth
  if (auth) {
    const token = getToken();
    if (token) h.Authorization = `Bearer ${token}`;
  }

  // ✅ GET/HEAD نباید body داشته باشد
  const shouldHaveBody = upper !== "GET" && upper !== "HEAD";

  const res = await fetch(url, {
    method: upper,
    headers: h,
    body: shouldHaveBody
      ? body
        ? isFormData
          ? body
          : JSON.stringify(body)
        : undefined
      : undefined,
  });

  const data = await safeReadBody(res);

  if (!res.ok) {
    if (res.status === 401) clearAuthStorage();

    const msg =
      data?.message ||
      data?.error ||
      data?.msg ||
      `HTTP ${res.status} ${res.statusText || ""}`.trim();

    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    err.url = url;
    throw err;
  }

  return data;
}

// axios-like helpers
apiClient.get = async (path, opts = {}) => {
  const data = await apiClient(path, { ...opts, method: "GET" });
  return { data };
};

apiClient.post = async (path, body, opts = {}) => {
  const data = await apiClient(path, { ...opts, method: "POST", body });
  return { data };
};

apiClient.patch = async (path, body, opts = {}) => {
  const data = await apiClient(path, { ...opts, method: "PATCH", body });
  return { data };
};

apiClient.delete = async (path, opts = {}) => {
  const data = await apiClient(path, { ...opts, method: "DELETE" });
  return { data };
};

export const api = apiClient;
