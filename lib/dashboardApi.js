// src/lib/dashboardApi.js
import { apiClient } from "./apiClient.js";

// These endpoints exist on your backend enterprise build
export async function fetchLatestOrders() {
  const out = await apiClient("/admin/orders?limit=10", { method: "GET", auth: true });
  return out;
}

export async function fetchTopProducts() {
  // If you later add a dedicated endpoint, replace this.
  const out = await apiClient("/admin/reports-range", { method: "GET", auth: true });
  return out;
}

export async function fetchDashboardStats() {
  const out = await apiClient("/admin/reports-range", { method: "GET", auth: true });
  return out;
}
