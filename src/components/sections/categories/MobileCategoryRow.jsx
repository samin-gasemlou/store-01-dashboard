import { useState } from "react";
import { ChevronDown, Settings, Trash2 } from "lucide-react";

export default function MobileCategoryRow({ category, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const count = Number(category?.productsCount ?? 0);

  return (
    <div className="bg-white rounded-xl border border-[#0000000D] overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-4 text-right"
        type="button"
      >
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        <span className="font-medium text-sm sm:text-base">
          {category?.name_en || "-"}
        </span>
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
            <span>{category?.name_en || "-"}</span>
            <span className="font-semibold">:ناوی پۆل</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="w-12 h-12 border rounded-xl flex items-center justify-center">
              <img
                src={category?.image || "/perfume.png"}
                alt=""
                className="h-8 object-contain"
              />
            </div>
            <span className="font-semibold">:وێنەی پۆل</span>
          </div>

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
