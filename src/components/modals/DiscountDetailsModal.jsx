import React, { useMemo } from "react";
import BaseModal from "../ui/BaseModal";

const DiscountDetailsModal = ({ isOpen, onClose, initialData, onSave }) => {
  const formKey = useMemo(() => {
    if (!isOpen) return "closed";
    return initialData?.id ? `edit-${initialData.id}` : "add";
  }, [isOpen, initialData?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const name = (fd.get("name") || "").toString().trim();
    const code = (fd.get("code") || "").toString().trim().toUpperCase();
    const percentRaw = (fd.get("percent") || "").toString().trim().replace("%", "");
    const date = (fd.get("date") || "").toString().trim(); // YYYY-MM-DD

    if (!name) return alert("نام تخفیف را وارد کنید");
    if (!code) return alert("کد تخفیف را وارد کنید");
    if (!percentRaw) return alert("درصد تخفیف را وارد کنید");
    if (!date) return alert("تاریخ انقضا را انتخاب کنید");

    const payload = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      name,
      code,
      percent: `${percentRaw}%`,
      date, // میلادی
    };

    onSave?.(payload);
    onClose?.();
  };

  // فقط اگر مقدار اولیه با فرمت YYYY-MM-DD بود، داخل date input نمایش میده
  const initialDateForInput =
    typeof initialData?.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(initialData.date)
      ? initialData.date
      : "";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "ویرایش کد تخفیف" : "افزودن کد تخفیف"}
      size="md"
    >
      <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Name & Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">نام تخفیف</label>
            <input
              name="name"
              type="text"
              defaultValue={initialData?.name || ""}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-right"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">کد تخفیف</label>
            <input
              name="code"
              type="text"
              defaultValue={(initialData?.code || "").toUpperCase()}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-left uppercase"
            />
          </div>
        </div>

        {/* Row 2: Date & Percentage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">درصد تخفیف</label>
            <div className="relative">
              <input
                name="percent"
                type="number"
                defaultValue={(initialData?.percent || "").toString().replace("%", "")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-left pl-8"
                min="0"
                max="100"
              />
              <span className="absolute left-3 top-3 text-gray-500">%</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">تاریخ انقضا</label>
            <input
              name="date"
              type="date"
              defaultValue={initialDateForInput}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-left"
            />
            <p className="text-xs text-gray-500">
              تاریخ از پنل انتخاب می‌شود (میلادی).
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center gap-4 pt-2">
          <button
            type="submit"
            className="px-8 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            ذخیره
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition-colors"
          >
            بستن
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default DiscountDetailsModal;
