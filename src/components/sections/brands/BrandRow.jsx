import { Settings, Trash2 } from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:4000/api/v1";
const API_ORIGIN = API_BASE.replace(/\/api\/v1$/, "");


export default function BrandRow({ brand, onEdit, onDelete }) {
  const count = Number(brand?.productsCount ?? 0);

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
        <span>{brand?.name || "-"}</span>
        
      </div>
    </div>
  );
}
