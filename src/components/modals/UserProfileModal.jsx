import React, { useMemo, useState } from "react";
import BaseModal from "../ui/BaseModal";
import { Instagram, Music2, ChevronDown } from "lucide-react";

const UserProfileModal = ({ isOpen, onClose, user }) => {
  const history = Array(5).fill(null).map((_, i) => ({
    id: `#568${i}`,
    profit: "500,000 IQD",
    total: "2,000,000 IQD",
  }));

  const formKey = useMemo(() => {
    if (!isOpen) return "closed";
    return user?.id ? `user-${user.id}` : "no-user";
  }, [isOpen, user?.id]);

  const [draft, setDraft] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [openCartId, setOpenCartId] = useState(null);

  const initialData = {
    name: user?.name || "مریم فداکار",
    phone: user?.phone || "09120001234",
    address: user?.address || "تهران، خیابان آزادی...",
    postalCode: user?.postalCode || "013345",
    registerDate: user?.registerDate || "1404/5/23",
  };

  const current = draft || initialData;

  const startEdit = (field) => {
    if (!draft) setDraft(initialData);
    setEditingField(field);
  };

  const changeValue = (field, value) => {
    setDraft((prev) => ({
      ...(prev || initialData),
      [field]: value,
    }));
  };

  const handleSave = () => {
    setEditingField(null);
    alert("اطلاعات کاربر بروزرسانی شد ✅");
  };

  const toggleCart = (id) => {
    setOpenCartId((p) => (p === id ? null : id));
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`پروفایل کاربر : ${current.name} (${user?.username || "نام کاربری"})`}
      size="xl"
    >
      <div key={formKey} className="flex overflow-y-auto flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 bg-slate-100/50 p-4 sm:p-5 rounded-xl space-y-4 border border-slate-100 h-fit">
          <div className="space-y-3 text-sm">
            {/* NAME */}
            <div>
              <p className="font-bold text-slate-700 mb-1">نام:</p>
              {editingField === "name" ? (
                <input
                  autoFocus
                  value={current.name}
                  onChange={(e) => changeValue("name", e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-right"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit("name")}
                  className="w-full text-right p-2 rounded-lg hover:bg-white/60"
                >
                  {current.name}
                </button>
              )}
            </div>

            {/* PHONE */}
            <div>
              <p className="font-bold text-slate-700 mb-1">شماره تلفن:</p>
              {editingField === "phone" ? (
                <input
                  autoFocus
                  value={current.phone}
                  onChange={(e) => changeValue("phone", e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-left"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit("phone")}
                  className="w-full text-right p-2 rounded-lg hover:bg-white/60"
                >
                  {current.phone}
                </button>
              )}
            </div>

            {/* ADDRESS */}
            <div>
              <p className="font-bold text-slate-700 mb-1">آدرس:</p>
              {editingField === "address" ? (
                <textarea
                  autoFocus
                  rows={3}
                  value={current.address}
                  onChange={(e) => changeValue("address", e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-right"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit("address")}
                  className="w-full text-right p-2 rounded-lg hover:bg-white/60 leading-6"
                >
                  {current.address}
                </button>
              )}
            </div>

            {/* POSTAL CODE */}
            <div>
              <p className="font-bold text-slate-700 mb-1">کد پستی:</p>
              {editingField === "postalCode" ? (
                <input
                  autoFocus
                  value={current.postalCode}
                  onChange={(e) => changeValue("postalCode", e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-left"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit("postalCode")}
                  className="w-full text-right p-2 rounded-lg hover:bg-white/60"
                >
                  {current.postalCode}
                </button>
              )}
            </div>

            <div className="flex gap-2 items-center mt-2">
              <Instagram size={16} />
              <img src="/tiktok.svg" alt="" />
            </div>

            <p className="mt-2">
              <span className="font-bold text-slate-700">تاریخ ثبت نام:</span>{" "}
              {current.registerDate}
            </p>
          </div>

          <div className="bg-slate-200/50 p-3 rounded-lg space-y-2 text-sm">
            <p className="flex justify-between">
              <span>مجموع سود خالص:</span>
              <span className="font-bold">
                {user?.netProfit?.toLocaleString?.() || "28,000"} IQD
              </span>
            </p>
            <p className="flex justify-between">
              <span>مجموع خرید:</span>
              <span className="font-bold">
                {user?.totalPurchase?.toLocaleString?.() || "145,000,000"} IQD
              </span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <button onClick={handleSave} className="bg-slate-800 text-white py-2 rounded-lg text-xs hover:bg-slate-900">
              ذخیره
            </button>
            <button className="bg-slate-400 text-white py-2 rounded-lg text-xs hover:bg-slate-500">
              حذف
            </button>
            <button className="bg-slate-400 text-white py-2 rounded-lg text-xs hover:bg-slate-500">
              بلاک
            </button>
          </div>
        </div>

        {/* History */}
        <div className="w-full bg-slate-50 lg:w-2/3">
          {/* ✅ DESKTOP TABLE (sm+) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3 rounded-r-lg">سبدهای خرید</th>
                  <th className="p-3">سود خالص</th>
                  <th className="p-3 rounded-l-lg">مبلغ کل</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="bg-white border-b border-gray-50 hover:bg-slate-50">
                    <td className="p-4 font-bold">{h.id}</td>
                    <td className="p-4">{h.profit}</td>
                    <td className="p-4">{h.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ MOBILE (<sm): فقط سبدهای خرید + آکاردئون */}
          <div className="sm:hidden space-y-3">
            <h3 className="text-right font-bold text-slate-800">سبدهای خرید</h3>

            {history.map((h, i) => {
              const isOpen = openCartId === h.id;

              return (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* فقط آی‌دی سبد */}
                  <button
                    type="button"
                    onClick={() => toggleCart(h.id)}
                    className="w-full flex items-center justify-between px-4 py-4"
                  >
                    <span className="font-bold text-slate-800">{h.id}</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* جزئیات با انیمیشن نرم */}
                  <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden px-4 pb-4 text-sm text-slate-700 space-y-3">
                      <div className="flex justify-between items-center pt-4 md:pt-0">
                        <span className="font-semibold">سود خالص:</span>
                        <span>{h.profit}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="font-semibold">مبلغ کل:</span>
                        <span className="font-bold">{h.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </BaseModal>
  );
};

export default UserProfileModal;
