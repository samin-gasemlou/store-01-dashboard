import { useState } from "react";
import { ChevronDown, Settings, Trash2 } from "lucide-react";

export default function MobileBrandRow({ brand, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const count = Number(brand?.productsCount ?? 0);

  return (
    <div className="bg-white rounded-xl border border-[#0000000D] overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-4 text-right"
        type="button"
      >
        <span className="font-medium text-sm sm:text-base">{brand?.name || "-"}</span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden px-4 pb-4 text-xs sm:text-sm space-y-3">
          <div className="flex justify-between">
            <span>{count} دانە</span>
            <span className="font-semibold">:ژمارەی بەرهەمی بەردەست</span>
          </div>

          <div className="flex justify-between">
            <span>{brand?.name || "-"}</span>
            <span className="font-semibold">:ناوی براند</span>
          </div>

          {/* ✅ تصویر حذف شد */}

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button type="button" onClick={onEdit} className="p-1">
                <Settings size={16} />
              </button>
              <button type="button" onClick={onDelete} className="p-1">
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
            <span className="font-semibold">:کردارەکان</span>
          </div>
        </div>
      </div>
    </div>
  );
}
