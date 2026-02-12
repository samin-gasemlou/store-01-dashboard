import React, { useMemo, useState } from "react";
import BaseModal from "../ui/BaseModal";
import { Download, BarChart2, Settings, ChevronDown } from "lucide-react";
import DiscountDetailsModal from "./DiscountDetailsModal";

const DiscountListModal = ({ isOpen, onClose }) => {
  const [openId, setOpenId] = useState(null);

  // ✅ لیست رو state کردیم تا بتونیم اضافه کنیم
  const [discounts, setDiscounts] = useState([
    { name: "instagram campain", date: "1404/3/30", code: "dfadpj-3jdo", percent: "30%", id: 1 },
    { name: "store-manage", date: "1404/3/30", code: "ree0-3s", percent: "50%", id: 2 },
    { name: "youtube", date: "1404/3/30", code: "mfkfn-s", percent: "76%", id: 3 },
  ]);

  // ✅ مودال جزئیات
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const nextId = useMemo(() => {
    const max = discounts.reduce((m, d) => Math.max(m, d.id), 0);
    return max + 1;
  }, [discounts]);

  const toggleRow = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const openAddModal = () => {
    setEditingItem(null);
    setDetailsOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setDetailsOpen(true);
  };

  const handleSaveDiscount = (payload) => {
    // اگر id داشت یعنی edit، اگر نداشت add
    if (payload.id) {
      setDiscounts((prev) => prev.map((d) => (d.id === payload.id ? { ...d, ...payload } : d)));
      return;
    }
    setDiscounts((prev) => [{ ...payload, id: nextId }, ...prev]);
  };

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={onClose} title="لیست کد های تخفیف" size="xl">
        {/* Top Actions */}
        <div className="flex justify-end gap-4 items-center mb-6">
          <button className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-300 text-sm">
            <Download size={16} />
            Excel
          </button>

          {/* ✅ کلیک => مودال جزئیات برای افزودن */}
          <button
            onClick={openAddModal}
            className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 text-sm"
          >
            افزودن کد تخفیف
          </button>
        </div>

        {/* ================= DESKTOP TABLE (md+) ================= */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-slate-600">
                <th className="pb-3 font-semibold">نام کد تخفیف</th>
                <th className="pb-3 font-semibold text-center">تاریخ انقضا</th>
                <th className="pb-3 font-semibold text-center">کد تخفیف</th>
                <th className="pb-3 font-semibold text-center">درصد تخفیف</th>
                <th className="pb-3 font-semibold text-left pl-4">دسترسی</th>
              </tr>
            </thead>

            <tbody className="text-sm text-slate-800">
              {discounts.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 font-medium">{item.name}</td>
                  <td className="py-4 text-center text-gray-500">{item.date}</td>
                  <td className="py-4 text-center font-mono text-slate-600">{item.code}</td>
                  <td className="py-4 text-center font-bold">{item.percent}</td>
                  <td className="py-4 flex justify-end gap-3 pl-2">
                    {/* ✅ Settings => باز کردن مودال ویرایش */}
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-slate-500 hover:text-blue-600"
                    >
                      <Settings size={18} />
                    </button>

                    <button className="text-slate-500 hover:text-blue-600">
                      <BarChart2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE LIST (<md) ================= */}
        <div className="md:hidden space-y-3">
          {discounts.map((item) => {
            const isOpenRow = openId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-[10px] overflow-hidden"
              >
                {/* فقط نام کد تخفیف */}
                <button
                  type="button"
                  onClick={() => toggleRow(item.id)}
                  className="w-full flex items-center justify-between px-4 py-4"
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${isOpenRow ? "rotate-180" : ""}`}
                  />
                  <span className="font-medium text-slate-800 text-right">{item.name}</span>
                </button>

                {/* جزئیات با انیمیشن نرم */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpenRow ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden px-4 pb-4 text-sm text-slate-700 space-y-3">
                    <div className="flex items-center justify-between py-3">
                      <span className="font-semibold text-right">تاریخ انقضا:</span>
                      <span className="text-gray-500 text-left break-all">{item.date}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold">کد تخفیف:</span>
                      <span className="font-mono text-slate-600 break-all">{item.code}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold">درصد تخفیف:</span>
                      <span className="font-bold">{item.percent}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="font-semibold">دسترسی:</span>
                      <div className="flex gap-5">
                        {/* ✅ Settings => باز کردن مودال ویرایش */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-slate-500 hover:text-blue-600 p-2"
                        >
                          <Settings size={18} />
                        </button>
                        <button className="text-slate-500 hover:text-blue-600 p-2">
                          <BarChart2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </BaseModal>

      {/* ✅ مودال جزئیات (افزودن/ویرایش) */}
      <DiscountDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        initialData={editingItem}
        onSave={handleSaveDiscount}
      />
    </>
  );
};

export default DiscountListModal;
