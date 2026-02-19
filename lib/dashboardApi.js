// src/lib/dashboardApi.js
import { apiClient } from "./apiClient.js";

/**
 * ✅ این فایل فقط endpointهای درست رو صدا می‌زنه
 * بدون اینکه اتصال‌های دیگه خراب بشن.
 *
 * فرض بک:
 * - GET /admin/orders?limit=10   => لیست سفارش‌ها (همون قبلی)
 * - GET /admin/reports-summary?period=today  => آمار کارت‌ها + topProducts + salesLast7Days
 * - GET /admin/reports-range (اگر داشتی) => برای صفحات Report/Range (اینجا دست نمی‌زنیم)
 */

// آخرین سفارش‌ها (برای جدول صفحه Home)
export async function fetchLatestOrders() {
  // سرویس orders.service شما خروجی { total,page,limit,data } میده
  // اینجا raw برمی‌گردونیم تا normalize در orders.service انجام بشه (اگر اون استفاده شد)
  return apiClient("/admin/orders?limit=10", { method: "GET", auth: true });
}

// تاپ محصولات (برای بخش TopProducts در داشبورد)
// از reports-summary می‌گیریم که topProducts واقعی دارد
export async function fetchTopProducts({ period = "today", date } = {}) {
  const qs = new URLSearchParams();
  if (period) qs.set("period", String(period));
  if (date) qs.set("date", String(date));
  const q = qs.toString();
  return apiClient(`/admin/reports-summary${q ? `?${q}` : ""}`, {
    method: "GET",
    auth: true,
  });
}

// آمار کارت‌های داشبورد (سفارش جدید / سود خالص امروز / فروش امروز)
// ✅ دقیقا چیزی که Dashboard.jsx انتظار داره: { newOrders, netProfitToday, salesToday }
export async function fetchDashboardStats({ period = "today", date } = {}) {
  const qs = new URLSearchParams();
  if (period) qs.set("period", String(period));
  if (date) qs.set("date", String(date));
  const q = qs.toString();

  const res = await apiClient(`/admin/reports-summary${q ? `?${q}` : ""}`, {
    method: "GET",
    auth: true,
  });

  // ساپورت چند شکل پاسخ (بعضی جاها apiClient.data میده)
  const payload = res?.data ?? res ?? {};

  // فقط فیلدهایی که Dashboard.jsx لازم دارد
  return {
    newOrders: Number(payload.newOrders ?? 0),
    netProfitToday: Number(payload.netProfitToday ?? 0),
    salesToday: Number(payload.salesToday ?? 0),

    // اگر جاهای دیگر هم خواستند استفاده کنند، بقیه را هم نگه می‌داریم
    ordersCount: Number(payload.ordersCount ?? 0),
    topProducts: payload.topProducts ?? [],
    salesLast7Days: payload.salesLast7Days ?? [],
    period: payload.period ?? period,
    startDate: payload.startDate,
    endDate: payload.endDate,
  };
}
