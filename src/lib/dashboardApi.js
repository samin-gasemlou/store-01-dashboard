// dashboard/src/lib/dashboardApi.js
import { apiClient } from "./apiClient.js";

function computeOrderTotal(order) {
  const items = Array.isArray(order?.items) ? order.items : [];
  const grossItems = items.reduce((s, it) => {
    const p = Number(it?.price ?? 0);
    const q = Number(it?.quantity ?? 0);
    return s + p * q;
  }, 0);

  const discount = Number(order?.discount ?? 0);
  const shippingCost = Number(order?.shippingCost ?? 0);

  // فروش سفارش = جمع آیتم‌ها - تخفیف + پول ارسال مشتری
  return Math.max(0, grossItems - discount + shippingCost);
}

function formatIQD(n) {
  const num = Number(n ?? 0);
  return `${num.toLocaleString()} IQD`;
}

function getCustomerName(order) {
  const u = order?.userId;

  if (u?.fullName) return u.fullName;

  const fn = String(u?.firstName ?? "").trim();
  const ln = String(u?.lastName ?? "").trim();
  const joined = `${fn} ${ln}`.trim();
  if (joined) return joined;

  if (u?.name) return u.name;
  if (order?.customerName) return order.customerName;
  if (order?.name) return order.name;

  // fallback: موبایل (بهتر لە خط تیره)
  if (u?.mobile) return u.mobile;

  return "—";
}

function mapStatus(order) {
  const st = String(order?.status ?? "").trim().toUpperCase();

  const map = {
    PENDING: { key: "pending", label: "لە انتظار بررسی" },
    ACCEPTED: { key: "complete", label: "تایید کراوە" },
    COMPLETED: { key: "complete", label: "تکمیل کراوە" },
    COMPLETE: { key: "complete", label: "تکمیل کراوە" },
    REJECTED: { key: "rejected", label: "رد کراوە" },
    CANCELED: { key: "rejected", label: "لغو کراوە" },
    CANCELLED: { key: "rejected", label: "لغو کراوە" },
  };

  return map[st] ?? { key: "pending", label: st || "—" };
}

function normalizeLatestOrdersResponse(res) {
  const payload = res?.data ?? res;
  const rows = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload)
        ? payload
        : [];

  return rows.map((o) => {
    const id = String(o?.invoiceNumber ?? o?._id ?? "").slice(-6);

    const status = mapStatus(o);
    const total = computeOrderTotal(o);

    return {
      id,
      customer: getCustomerName(o),
      price: formatIQD(total),
      status: status.key,
      statusLabel: status.label,

      _raw: o,
      _mongoId: o?._id,
    };
  });
}

// ✅ آخرین سفارش‌ها (بۆ هوم داشبورد)
export async function fetchLatestOrders(limit = 6) {
  const l = Math.min(6, Math.max(1, Number(limit || 6)));

  const out = await apiClient(`/admin/orders?limit=${l}&sort=-createdAt`, {
    method: "GET",
    auth: true,
  });

  return normalizeLatestOrdersResponse(out);
}

/**
 * ✅ Top Products واقعی
 * بک شما: GET /admin/reports-summary?period=today
 * خروجی: { topProducts: [{ productId, title, salesCount, ... }], ... }
 *
 * اینجا فقط topProducts را normalize میکنیم تا UI راحت بخونه:
 * [{ id, title, count }]
 */
export async function fetchTopProducts(limit = 6) {
  const l = Math.min(6, Math.max(1, Number(limit || 6)));

  const out = await apiClient("/admin/reports-summary?period=today", {
    method: "GET",
    auth: true,
  });

  const payload = out?.data ?? out ?? {};
  const rows = Array.isArray(payload?.topProducts) ? payload.topProducts : [];

  return rows.slice(0, l).map((x, idx) => ({
    id: String(x?.productId ?? x?._id ?? idx),
    title: String(x?.title ?? x?.name_en ?? x?.name ?? "—"),
    count: Number(x?.salesCount ?? x?.count ?? 0),
    _raw: x,
  }));
}

export async function fetchDashboardStats() {
  const out = await apiClient("/admin/reports-summary?period=today", {
    method: "GET",
    auth: true,
  });
  return out?.data ?? out;
}
