import { useState } from "react";
import { ChevronDown, Settings, Trash2 } from "lucide-react";

export default function MobileBrandRow({ onEdit }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#0000000D] overflow-hidden">
      {/* HEADER */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-4 text-right"
      >
        <span className="font-medium text-sm sm:text-base">آرایشی، بهداشتی</span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* CONTENT */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden px-4 pb-4 text-xs sm:text-sm space-y-3">
          {/* COUNT */}
          <div className="flex justify-between">
            <span>عدد 70</span>
            <span className="font-semibold">:تعداد محصول موجود</span>
          </div>

          {/* NAME */}
          <div className="flex justify-between">
            <span>آرایشی، بهداشتی</span>
            <span className="font-semibold">:نام برند</span>
          </div>

          {/* IMAGE */}
          <div className="flex justify-between items-center">
            <div className="w-12 h-12 border rounded-xl flex items-center justify-center">
              <img src="/perfume.png" alt="" className="h-8 object-contain" />
            </div>
            <span className="font-semibold">:تصویر برند</span>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button type="button" onClick={onEdit} className="p-1">
                <Settings size={16} />
              </button>
              <button type="button" className="p-1">
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
            <span className="font-semibold">:عملیات</span>
          </div>
        </div>
      </div>
    </div>
  );
}
