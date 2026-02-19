import { apiClient } from "../lib/apiClient.js";

function qs(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export async function fetchReportsSummary({ period = "today", date } = {}) {
  return apiClient(`/admin/reports-summary${qs({ period, date })}`, {
    method: "GET",
    auth: true,
  });
}

export async function fetchReportsRange({ startDate, endDate } = {}) {
  return apiClient(`/admin/reports-range${qs({ startDate, endDate })}`, {
    method: "GET",
    auth: true,
  });
}
