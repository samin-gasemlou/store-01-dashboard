import { useState } from "react";
import { Settings, Trash2, ChevronDown } from "lucide-react";

export default function OrderRow({ order, onDelete, onSettings }) {
  const [open, setOpen] = useState(false);

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
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex flex-row justify-between text-right items-center py-4 text-sm border-b-2 border-b-[#0000000D]">
        <div className="flex gap-3">
          <button onClick={onSettings}>
            <Settings size={16} />
          </button>
          <button onClick={onDelete}>
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>

        <span className="font-medium">#{order.id}</span>
        <span>{order.invoice}</span>

        <span className={`px-2 py-1 rounded-lg font-bold ${getStatusColor(order.status)}`}>
          {order.status}
        </span>

        <span>{order.date}</span>
        <span>{order.customer}</span>
      </div>

      {/* ================= MOBILE / TABLET ================= */}
      <div className="md:hidden border-b border-[#0000000D]">
        {/* Header */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center py-4 text-sm font-medium"
        >
          <div className="flex flex-col text-right">
            <span>{order.customer}</span>
            <span className="text-xs text-gray-400">#{order.id}</span>
          </div>

          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Content */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden text-xs space-y-3 pb-4">
            
            <div className="flex justify-between">
              <span>{order.invoice}</span>
              <span className="font-semibold">:مجموع فاکتور</span>
            </div>

            <div className="flex justify-between">
              <span className={`px-2 py-1 rounded-lg font-bold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <span className="font-semibold">:وضعیت سفارش</span>
            </div>

            <div className="flex justify-between">
              <span>{order.date}</span>
              <span className="font-semibold">:تاریخ</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <button onClick={onSettings}>
                  <Settings size={16} />
                </button>
                <button onClick={onDelete}>
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
              <span className="font-semibold">:عملیات</span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
