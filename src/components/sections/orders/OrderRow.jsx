import { Settings, Trash2 } from "lucide-react";

export default function OrderRow({ order, onDelete, onOpenDetails }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "تکمیل شده":
        return "text-[#0D9747] bg-[#E7F8F0]";
      case "در انتظار بررسی":
        return "text-[#F2994A] bg-[#FFF8ED]";
      case "لغو شده":
        return "text-[#EB5757] bg-[#FFF0F0]";
      default:
        return "text-[#273959] bg-[#F2F3F5]";
    }
  };

  return (
    <>
      {/* ================= DESKTOP (md+) ================= */}
      <div className="hidden md:grid grid-cols-6 items-center py-4 text-sm border-b-2 border-b-[#0000000D] text-center px-4">
        {/* عملیات */}
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

        <div className="flex items-center justify-center font-medium">#{order.id}</div>
        <div className="flex items-center justify-center">{order.invoice}</div>

        <div className="flex items-center justify-center">
          <span className={`px-3 py-1 rounded-lg font-bold inline-flex items-center justify-center ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="flex items-center justify-center">{order.date}</div>
        <div className="flex items-center justify-center">{order.customer}</div>
      </div>

      {/* ================= MOBILE (<md) ================= */}
      <button
        type="button"
        onClick={onOpenDetails}
        className="md:hidden w-full flex items-center justify-between py-4 px-4 border-b border-[#0000000D]"
      >
        {/* وضعیت */}
        <span className={`px-3 py-1 rounded-lg font-bold text-xs inline-flex items-center justify-center ${getStatusColor(order.status)}`}>
          {order.status}
        </span>

        {/* نام کاربر */}
        <span className="text-sm font-medium text-slate-800 text-right">
          {order.customer}
        </span>
      </button>
    </>
  );
}
