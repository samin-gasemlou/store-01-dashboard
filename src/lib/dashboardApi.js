// dashboard/src/lib/dashboardApi.js
import { apiClient } from "./apiClient.js";

/**
 * بک شما (طبق چیزی که قبلاً زدید) اینا رو داشت:
 * - GET /admin/orders?limit=10
 * - GET /admin/reports-range  (یا چیزی شبیه این)
 *
 * اگر اسم endpoint فرق داشت، فقط همین فایل رو اصلاح می‌کنی.
 */

function safeFaDate(d) {
  try {
    return new Date(d).toLocaleDateString("fa-IR");
  } catch {
    return "-";
  }
}

function normalizeOrderRow(o) {
  const id = o?._id || o?.id || o?.invoiceNumber || "-";
  const total = o?.total != null ? `${Number(o.total).toLocaleString()} IQD` : "-";

  const user = o?.userId || o?.user || {};
  const customer =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.phone1 ||
    o?.customer ||
    "-";

  const status = o?.status || "pending";

  const statusLabelMap = {
    pending: "در انتظار بررسی",
    complete: "تکمیل شده",
    rejected: "لغو شده",
    canceled: "لغو شده",
  };

  return {
    id,
    customer,
    price: total,
    status,
    statusLabel: statusLabelMap[status] || status,
    date: safeFaDate(o?.createdAt),
    invoice: total,
    items: o?.items || [],
    user,
    address: o?.address,
    city: o?.city,
  };
}

export async function fetchLatestOrders(limit = 10) {
  const res = await apiClient(`/admin/orders?limit=${limit}`, { auth: true });

  // بعضی وقت‌ها بک {items:[], total:..} میده، بعضی وقت‌ها مستقیم آرایه
  const list = Array.isArray(res) ? res : (res?.items || res?.data || []);
  return list.map(normalizeOrderRow);
}

export async function fetchOrderById(id) {
  return apiClient(`/admin/orders/${id}`, { auth: true });
}

export async function fetchDashboardStats() {
  // اگر endpoint واقعی‌ت فرق داشت اینو عوض کن
  const res = await apiClient(`/admin/reports-range`, { auth: true });

  // سعی می‌کنیم چند حالت مختلف رو پشتیبانی کنیم
  return {
    newOrders: res?.newOrders ?? res?.ordersToday ?? 0,
    salesToday: res?.salesToday ?? res?.totalToday ?? 0,
    netProfitToday: res?.netProfitToday ?? res?.profitToday ?? 0,
  };
}

export async function fetchSalesLast7Days() {
  // اگر بک endpoint مخصوص نمودار داشت، اینجا بزن.
  // فعلاً از reports-range اگر چیزی داشت می‌کشیم، وگرنه [] می‌دیم.
  const res = await apiClient(`/admin/reports-range`, { auth: true });

  // انتظار: [{day:'شنبه', value:123}] یا چیزی شبیه
  const rows = res?.salesLast7Days || res?.chart7days || [];
  return Array.isArray(rows) ? rows : [];
}

export async function fetchTopProducts(limit = 10) {
  // اگر بک endpoint جدا برای top products نداره، فعلاً خالی برگرده تا mock بمونه
  const res = await apiClient(`/admin/reports-range`, { auth: true });

  const rows = res?.topProducts || [];
  if (!Array.isArray(rows)) return [];

  // نرمال به فرمت UI شما: {id,title,count}
  return rows.slice(0, limit).map((x, idx) => ({
    id: x?._id || x?.id || idx + 1,
    title: x?.title || x?.name_en || x?.name || "—",
    count: x?.count ?? x?.salesCount ?? 0,
  }));
}
