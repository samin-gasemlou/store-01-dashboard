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

    if (!name) return alert("تکایە ناوی داشکاندن بنووسە");
    if (!code) return alert("تکایە کۆدی داشکاندن بنووسە");
    if (!percentRaw) return alert("تکایە ڕێژەی داشکاندن بنووسە");
    if (!date) return alert("تکایە ڕێکەوتی بەسەرچوون هەڵبژێرە");

    const payload = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      name,
      code,
      percent: `${percentRaw}%`,
      date,
    };

    onSave?.(payload);
    onClose?.();
  };

  // ✅ FIX: ناو لە چەند فیلدێکی جیاوازدا
  const initialName =
    (initialData?.name || "").toString().trim() ||
    (initialData?.title || "").toString().trim() ||
    (initialData?.label || "").toString().trim() ||
    "";

  // ✅ FIX: ڕێکەوتی هاتوو بۆ dateInput (کە لە normalize دێت)
  const initialDateForInput =
    typeof initialData?.dateInput === "string" && /^\d{4}-\d{2}-\d{2}$/.test(initialData.dateInput)
      ? initialData.dateInput
      : "";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "دەستکاریکردنی کۆدی داشکاندن" : "زیادکردنی کۆدی داشکاندن"}
      size="md"
    >
      <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Name & Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">ناوی داشکاندن</label>
            <input
              name="name"
              type="text"
              defaultValue={initialName}  
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-right"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">کۆدی داشکاندن</label>
            <input
              name="code"
              type="text"
              defaultValue={(initialData?.code || "").toString().toUpperCase()}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-left uppercase"
            />
          </div>
        </div>

        {/* Row 2: Date & Percentage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">ڕێژەی داشکاندن</label>
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
            <label className="text-sm font-semibold text-slate-700">ڕێکەوتی بەسەرچوون</label>
            <input
              name="date"
              type="date"
              defaultValue={initialDateForInput}  
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-left"
            />
            <p className="text-xs text-gray-500">ڕێکەوت لە پانێڵی هەڵبژاردن دیاری دەکرێت (میلادی).</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-center gap-4 pt-2">
          <button
            type="submit"
            className="px-8 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            پاشەکەوتکردن
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-2.5 bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition-colors"
          >
            داخستن
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default DiscountDetailsModal;
