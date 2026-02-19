import { Settings, Trash2 } from "lucide-react";

function formatIQD(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  return `${num.toLocaleString()} IQD`;
}

// ✅ حل مشکل ناو مشتری (پشتیبانی لە همه ساختارهای بک + جلوگیری لە خطا وقتی userId فقط ObjectId ە)
function resolveCustomerName(order) {
  if (!order) return "—";

  // ئەگەر لە قبل آماده کراوە باشد (لە OrdersTable یان هر جای دیگر)
  const direct = String(order?.customer || "").trim();
  if (direct) return direct;

  // snapshot داخل سفارش (طبق بک نوێ)
  const snapName =
    String(order?.checkoutFullName || "").trim() ||
    String(order?.customerName || "").trim();
  if (snapName) return snapName;

  // fallback ژمارە‌های snapshot
  const snapPhone =
    String(order?.checkoutMobile1 || "").trim() ||
    String(order?.checkoutMobile2 || "").trim() ||
    String(order?.customerMobile || "").trim();
  if (snapPhone) return snapPhone;

  // populate user (ممکن ە object باشد یان فقط id)
  const u = order?.userId || order?.user || order?.appUser || null;

  // ئەگەر فقط ObjectId/String بود، ازش اسم لە نمیاد
  if (u && typeof u === "object") {
    const fullName =
      String(u?.fullName || "").trim() ||
      String(u?.name || "").trim();
    if (fullName) return fullName;

    const first = String(u?.firstName || "").trim();
    const last = String(u?.lastName || "").trim();
    const fl = `${first} ${last}`.trim();
    if (fl) return fl;

    const username = String(u?.username || "").trim();
    if (username) return username;

    const phone =
      String(u?.mobile || "").trim() ||
      String(u?.phone1 || "").trim() ||
      String(u?.phone || "").trim();
    if (phone) return phone;
  }

  // fallback های قدیمی
  const legacy =
    String(order?.name || "").trim() ||
    String(order?.fullName || "").trim();
  if (legacy) return legacy;

  return "—";
}

export default function OrderRow({ order, onDelete, onOpenDetails }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "تکمیل کراوە":
        return "text-[#0D9747] bg-[#E7F8F0]";
      case "لە انتظار بررسی":
        return "text-[#F2994A] bg-[#FFF8ED]";
      case "لغو کراوە":
        return "text-[#EB5757] bg-[#FFF0F0]";
      case "پذیرفته کراوە":
        return "text-[#2B4168] bg-[#EEF3FF]";
      default:
        return "text-[#273959] bg-[#F2F3F5]";
    }
  };

  const code = order?.invoiceNumber || order?.id || "—";

  const computedTotal =
    Array.isArray(order?.items)
      ? order.items.reduce((sum, it) => {
          const p = Number(it?.price ?? 0);
          const q = Number(it?.quantity ?? 0);
          return sum + p * q;
        }, 0)
      : null;

  const total = order?.total ?? computedTotal;

  // ✅ اسم مشتری
  const customerName = resolveCustomerName(order);

  return (
    <>
      <div className="hidden md:grid grid-cols-6 items-center py-4 text-sm border-b-2 border-b-[#0000000D] text-center px-4">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onOpenDetails}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100"
          >
            <Settings size={16} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>

        <div className="flex items-center justify-center font-medium">#{code}</div>

        <div className="flex items-center justify-center">
          {total != null ? formatIQD(total) : "—"}
        </div>

        <div className="flex items-center justify-center">
          <span
            className={`px-3 py-1 rounded-lg font-bold inline-flex items-center justify-center ${getStatusColor(
              order?.status
            )}`}
          >
            {order?.status || "—"}
          </span>
        </div>

        <div className="flex items-center justify-center">{order?.date || "—"}</div>

        <div className="flex items-center justify-center">{customerName}</div>
      </div>

      {/* MOBILE */}
      <button
        type="button"
        onClick={onOpenDetails}
        className="md:hidden w-full flex items-center justify-between py-4 px-4 border-b border-[#0000000D]"
      >
        <span
          className={`px-3 py-1 rounded-lg font-bold text-xs inline-flex items-center justify-center ${getStatusColor(
            order?.status
          )}`}
        >
          {order?.status || "—"}
        </span>

        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-medium text-slate-800 text-right">
            {customerName}
          </span>
          <span className="text-xs text-slate-500">#{code}</span>
        </div>
      </button>
    </>
  );
}
