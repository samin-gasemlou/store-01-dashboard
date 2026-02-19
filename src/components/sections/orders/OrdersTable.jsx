// dashboard/src/components/sections/orders/OrdersTable.jsx
import { useState } from "react";
import OrderRow from "./OrderRow";
import OrderDetailsModal from "../../modals/OrderDetailsModal";
import { fetchOrderById, deleteOrder, fetchOrders } from "../../../services/orders.service.js";
import { useOrders } from "../../../hooks/useOrders.js";

const statusLabelMap = {
  PENDING: "لە انتظار بررسی",
  ACCEPTED: "پذیرفته کراوە",
  COMPLETE: "تکمیل کراوە",
  COMPLETED: "تکمیل کراوە",
  CANCELED: "لغو کراوە",
  CANCELLED: "لغو کراوە",
};

function safeFaDate(d) {
  try {
    return new Date(d).toLocaleDateString("fa-IR");
  } catch {
    return "-";
  }
}

function computeTotalFromItems(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, it) => {
    const p = Number(it?.price ?? 0);
    const q = Number(it?.quantity ?? 0);
    return sum + p * q;
  }, 0);
}

// ✅ مهم: همه‌ی حالت‌های بک/قدیمی/نوێ رو پوشش دە‌ده (بدون تغییر UI)
function getCustomerDisplay(o) {
  const u = o?.userId || o?.user || null;

  // ئەگەر populate کراوە بود
  if (u && typeof u === "object") {
    const fullName = String(u?.fullName ?? "").trim();
    if (fullName) return fullName;

    const name = String(u?.name ?? "").trim();
    if (name) return name;

    const fn = String(u?.firstName ?? "").trim();
    const ln = String(u?.lastName ?? "").trim();
    const joined = `${fn} ${ln}`.trim();
    if (joined) return joined;

    const mobile =
      String(u?.mobile ?? "").trim() ||
      String(u?.phone1 ?? "").trim() ||
      String(u?.phone ?? "").trim();
    if (mobile) return mobile;
  }

  // snapshot های نوێ سفارش (بدون وابستگی بە AppUser)
  const checkoutName =
    String(o?.checkoutFullName ?? "").trim() ||
    String(o?.customerName ?? "").trim();

  if (checkoutName) return checkoutName;

  // fallback موبایل‌های checkout یان فیلدهای قدیمی
  const checkoutMobile =
    String(o?.checkoutMobile1 ?? "").trim() ||
    String(o?.checkoutMobile2 ?? "").trim() ||
    String(o?.customerMobile ?? "").trim();

  if (checkoutMobile) return checkoutMobile;

  // fallback های احتمالی
  const any =
    String(o?.customer ?? "").trim() ||
    String(o?.name ?? "").trim() ||
    "—";

  return any || "—";
}

function normalizeOrderForUI(o) {
  const id = String(o?._id || o?.id || "");
  const invoiceNo = o?.invoiceNumber ? String(o.invoiceNumber) : id;

  const rawStatus = String(o?.status || "PENDING").toUpperCase();
  const statusLabel = statusLabelMap[rawStatus] || rawStatus;

  const computedTotal = computeTotalFromItems(o?.items);
  const total = o?.total ?? computedTotal;

  return {
    id,
    invoiceNumber: invoiceNo,
    total, // OrderRow ازش استفاده دە‌کنه
    invoice: `${Number(total || 0).toLocaleString()} IQD`,
    rawStatus,
    status: statusLabel,
    date: o?.createdAt ? safeFaDate(o.createdAt) : "-",
    customer: getCustomerDisplay(o),

    // بۆ مودال/جزئیات
    user: o?.userId || o?.user || null,
    address: o?.address ?? "",
    city: o?.city ?? "",
    items: Array.isArray(o?.items) ? o.items : [],
    __raw: o,
  };
}

export default function OrdersTable() {
  const { orders, setOrders, loading } = useOrders();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const refresh = async () => {
    const out = await fetchOrders({ page: 1, limit: 50, sort: "-createdAt" });

    // ✅ بک ممکنه {data} یان {items} یان {data:{data}} بده
    const payload = out?.data ?? out;
    const items =
      Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.data?.data)
            ? payload.data.data
            : [];

    const normalized = (items || [])
      .filter((x) => x && (x._id || x.id))
      .map(normalizeOrderForUI);

    setOrders(normalized);
  };

  const openDetails = async (order) => {
    try {
      const full = await fetchOrderById(order.id);

      // ✅ بک ممکنه full رو داخل data برگردونه
      const raw = full?.data ?? full;

      const fullItems = Array.isArray(raw?.items) ? raw.items : [];
      const fullTotal = raw?.total ?? computeTotalFromItems(fullItems);

      const normalizedForModal = {
        id: String(raw?._id || order.id),
        invoiceNumber: raw?.invoiceNumber || order.invoiceNumber,
        invoice: `${Number(fullTotal || 0).toLocaleString()} IQD`,
        rawStatus: String(raw?.status || order.rawStatus || "PENDING").toUpperCase(),
        status: statusLabelMap[String(raw?.status || order.rawStatus || "PENDING").toUpperCase()] || order.status,
        date: raw?.createdAt ? safeFaDate(raw.createdAt) : order.date,

        // ✅ اینجاست کە ناو کاربر دقیق دە‌شه
        customer: getCustomerDisplay(raw),

        user: raw?.userId || raw?.user || order.user || null,
        items: fullItems,
        address: raw?.address ?? order.address ?? "",
        city: raw?.city ?? order.city ?? "",
        shippingCost: Number(raw?.shippingCost ?? 0),
        discount: Number(raw?.discount ?? 0),
        promoCode: raw?.promoCode ?? "",
      };

      setSelectedOrder(normalizedForModal);
      setDetailsOpen(true);
    } catch (e) {
      console.error(e);
      alert(e?.message || "خطا لە دریافت جزئیات سفارش");
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!confirm("دڵنیای؟ دە‌خواهید ئەم سفارش حذف شود؟")) return;

    const snapshot = orders;
    setOrders((prev) => prev.filter((x) => x.id !== id));

    try {
      await deleteOrder(id);
      await refresh();
      alert("سفارش حذف شد");
    } catch (e) {
      console.error(e);
      setOrders(snapshot);
      alert(e?.message || "حذف سفارش ناموفق بود");
    }
  };

  return (
    <div>
      <h2 className="text-right text-[#273959] font-bold text-[20px] mb-6">
        لیست سفارش‌ها
      </h2>

      <div className="hidden md:grid grid-cols-6 items-center text-[15px] font-extrabold text-[#000000] pb-3 border-b-2 border-b-[#0000004D] px-4 text-center">
        <span>عملیات</span>
        <span>کد سفارش</span>
        <span>فاکتور</span>
        <span>دۆخ</span>
        <span>ڕێکەوت</span>
        <span>ناو کاربر</span>
      </div>

      <div className="divide-y px-0 md:px-4">
        {loading ? (
          <div className="py-6 text-center text-sm text-gray-500">لە حال دریافت...</div>
        ) : orders.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-500">سفارشی یافت نشد</div>
        ) : (
          orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onDelete={() => handleDelete(order.id)}
              onOpenDetails={() => openDetails(order)}
            />
          ))
        )}
      </div>

      <OrderDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        order={selectedOrder}
        onAfterChange={async () => {
          setDetailsOpen(false);
          await refresh();
        }}
      />
    </div>
  );
}
