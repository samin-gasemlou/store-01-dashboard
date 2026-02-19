import { Settings, Trash2 } from "lucide-react";

export default function CategoryRow({ category, onEdit, onDelete }) {
  const count = Number(category?.productsCount ?? 0);

  return (
    <div className="flex justify-between items-center py-4 text-xs sm:text-sm border-b-2 border-b-[#0000000D]">
      <div className="flex items-center gap-16">
        <div className="flex gap-3">
          <button type="button" onClick={onEdit} className="cursor-pointer">
            <Settings size={14} className="sm:w-4 sm:h-4" />
          </button>

          <button type="button" onClick={onDelete} className="cursor-pointer">
            <Trash2 size={14} className="text-red-500 sm:w-4 sm:h-4" />
          </button>
        </div>

        <span className="font-medium">{count} دانە</span>
      </div>

      <div className="flex items-center gap-16">
        <span>{category?.name_en || "-"}</span>
        <div className="w-12 h-12 sm:w-14 sm:h-14 border rounded-xl flex items-center justify-center">
          <img
            src={category?.image || "/perfume.png"}
            alt=""
            className="h-8 sm:h-10 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
