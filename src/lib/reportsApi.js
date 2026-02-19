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

/**
 * ✅ NEW: ورودی همون selectedDate UI شماست: "امروز" | "دیروز" | "۷ روز اخیر" | "۳۰ روز اخیر" | "YYYY-MM-DD"
 * خروجی: همون response بک.
 */
export async function fetchReportsSummaryBySelectedDate(selectedDate = "امروز") {
  const s = String(selectedDate || "").trim();

  // ڕێکەوت دستی (input type="date") معمولاً "YYYY-MM-DD"
  const isYMD = /^\d{4}-\d{2}-\d{2}$/.test(s);

  if (isYMD) {
    return fetchReportsSummary({ period: "date", date: s });
  }

  if (s === "امروز") return fetchReportsSummary({ period: "today" });
  if (s === "دیروز") return fetchReportsSummary({ period: "yesterday" });
  if (s === "۷ روز اخیر") return fetchReportsSummary({ period: "last7" });
  if (s === "۳۰ روز اخیر") return fetchReportsSummary({ period: "last30" });

  // fallback
  return fetchReportsSummary({ period: "today" });
}
