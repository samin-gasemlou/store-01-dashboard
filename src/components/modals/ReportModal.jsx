import React, { useMemo, useState } from "react";
import BaseModal from "../ui/BaseModal";
import { Download, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const ReportModal = ({ isOpen, onClose }) => {
  const [openId, setOpenId] = useState(null);

  const users = useMemo(
    () => [
      { id: 1, name: "سارا جهان بخش", profit: "135,000 IQD", total: "432,000 IQD", count: "16 عدد" },
      { id: 2, name: "حسین فیز طالبی", profit: "130,000 IQD", total: "426,000 IQD", count: "13 عدد" },
      { id: 3, name: "علی اکبر دانا", profit: "105,000 IQD", total: "250,000 IQD", count: "8 عدد" },
      { id: 4, name: "امیرحسین صالحی", profit: "67,000 IQD", total: "174,000 IQD", count: "4 عدد" },
    ],
    []
  );

  const toggleRow = (id) => setOpenId((p) => (p === id ? null : id));

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="مشتریان وفادار : گزارش ماهیانه" size="lg">
      {/* ✅ Top Actions (Responsive) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="text-right text-xs sm:text-sm text-slate-500">
          10 مورد آخر نمایش داده می‌شود
        </div>

        <button
          className="
            w-full sm:w-auto
            bg-slate-100 text-slate-700
            px-4 py-2
            rounded-xl
            flex items-center justify-center gap-2
            hover:bg-slate-200
            text-sm
            border border-slate-200
            transition
          "
        >
          <Download size={16} />
          Excel
        </button>
      </div>

      {/* ✅ Desktop/Tablet Table */}
      <div className="hidden sm:block">
        {/* فقط لیست اسکرول بخورد */}
        <div className="max-h-[68vh] overflow-y-auto rounded-xl border border-gray-100">
          <table className="w-full text-right text-sm table-fixed">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-slate-500 border-b border-gray-200">
                <th className="py-3 px-4 font-semibold w-[40%]">نام کاربری</th>
                <th className="py-3 px-4 font-semibold w-[20%] whitespace-nowrap">سود خالص</th>
                <th className="py-3 px-4 font-semibold w-[25%] whitespace-nowrap">مجموع خرید</th>
                <th className="py-3 px-4 font-semibold w-[15%] text-left whitespace-nowrap">تعداد</th>
              </tr>
            </thead>

            <tbody className="text-slate-800">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <Link
                      to="/users"
                      className="block hover:text-blue-600 font-medium truncate"
                      title={u.name}
                    >
                      {u.name}
                    </Link>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">{u.profit}</td>
                  <td className="py-4 px-4 whitespace-nowrap">{u.total}</td>
                  <td className="py-4 px-4 text-left whitespace-nowrap">{u.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Mobile: فقط نام + آکاردئون حرفه‌ای */}
      <div className="sm:hidden">
        <div className="max-h-[70vh] overflow-y-auto space-y-3">
          {users.map((u) => {
            const isOpen = openId === u.id;

            return (
              <div
                key={u.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
              >
                {/* فقط نام */}
                <button
                  type="button"
                  onClick={() => toggleRow(u.id)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-4"
                >
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />

                  {/* لینک جدا از دکمه (کلیک روی لینک، آکاردئون رو تغییر نده) */}
                  <Link
                    to="/users"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 text-right font-semibold text-slate-800 hover:text-blue-600 truncate"
                    title={u.name}
                  >
                    {u.name}
                  </Link>
                </button>

                {/* جزئیات با انیمیشن نرم + بدون بیرون‌زدگی */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden px-4 pb-4 text-sm text-slate-700 space-y-3">
                    <div className="flex items-center justify-between gap-4 pt-4">
                      <span className="font-semibold whitespace-nowrap">سود خالص:</span>
                      <span className="text-left whitespace-nowrap">{u.profit}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold whitespace-nowrap">مجموع خرید:</span>
                      <span className="text-left whitespace-nowrap">{u.total}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold whitespace-nowrap">تعداد خرید:</span>
                      <span className="text-left whitespace-nowrap">{u.count}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BaseModal>
  );
};

export default ReportModal;
