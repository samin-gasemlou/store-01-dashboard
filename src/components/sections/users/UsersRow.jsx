import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function UsersRow({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ===== DESKTOP ROW (UNCHANGED) ===== */}
      <div
        className="
          hidden lg:grid
          grid-cols-5
          items-center
          text-[14px]
          border-b
          border-b-[#0000000D]
          py-4
          last:border-none
        "
      >
        <span className="text-left whitespace-nowrap">
          {user.purchaseCount} عدد
        </span>

        <span className="text-center whitespace-nowrap">
          {user.totalPurchase.toLocaleString()} IQD
        </span>

        <span className="text-center whitespace-nowrap">
          {user.netProfit.toLocaleString()} IQD
        </span>

        <span className="text-center whitespace-nowrap">
          {user.registerDate}
        </span>

        <span className="text-right font-medium">
          {user.username}
        </span>
      </div>

      {/* ===== MOBILE & TABLET ACCORDION ===== */}
      <div className="lg:hidden border-b border-b-[#0000000D]">
        {/* HEADER */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between py-3 text-right text-[14px] font-medium"
        >
          {user.username}
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* CONTENT */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            open ? "max-h-52 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-2 text-[13px]">
            <div className="flex justify-between">
              <span>تعداد خرید</span>
              <span>{user.purchaseCount} عدد</span>
            </div>

            <div className="flex justify-between">
              <span>مجموع خرید</span>
              <span>{user.totalPurchase.toLocaleString()} IQD</span>
            </div>

            <div className="flex justify-between">
              <span>سود خالص</span>
              <span>{user.netProfit.toLocaleString()} IQD</span>
            </div>

            <div className="flex justify-between">
              <span>تاریخ ثبت نام</span>
              <span>{user.registerDate}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
