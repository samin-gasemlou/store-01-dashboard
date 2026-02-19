import { useState } from "react";
import { ChevronDown, Settings, Trash2 } from "lucide-react";

export default function MobileProductRow({
  product,
  toggleActive,
  deleteProduct,
  editProduct,
}) {
  const [open, setOpen] = useState(false);

  const stockStatus =
    product.stock === 0 ? "بەردەست نییە" : product.stock < 10 ? "کەمە" : "بەردەستە";

  const onEdit = () => {
    if (typeof editProduct === "function") {
      editProduct(product);
      return;
    }
    window.location.href = "/products/add";
  };

  const onDelete = async () => {
    await deleteProduct(product.id);
  };

  const onToggle = async () => {
    if (!product?.id) return;
    await toggleActive(product.id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-4 text-right"
        type="button"
      >
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        <span className="font-bold text-sm">{product.name}</span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-250 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 pb-4 text-xs space-y-3">
          <div className="flex justify-between items-center">
            <img
              src={product.img}
              className="w-12 h-12 rounded-lg bg-black"
              alt={product.name}
            />
            <span className="font-semibold">:وێنە</span>
          </div>

          <div className="flex justify-between">
            <span>{product.expire}</span>
            <span className="font-semibold">:ڕێکەوتی بەسەرچوون</span>
          </div>

          <div className="flex justify-between">
            <span>
              {product.stock} دانە
              <span className="text-gray-400 mr-1">({stockStatus})</span>
            </span>
            <span className="font-semibold">:کۆگا</span>
          </div>

          <div className="flex justify-between">
            <span>{product.price}</span>
            <span className="font-semibold">:نرخی فرۆشتن</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={onEdit} type="button">
                <Settings size={16} />
              </button>

              <button onClick={onDelete} type="button">
                <Trash2 size={16} className="text-red-500" />
              </button>

              <button
                onClick={onToggle}
                className={`w-8 h-4 rounded-full relative transition ${
                  product.active ? "bg-green-500" : "bg-gray-300"
                }`}
                type="button"
              >
                <span
                  className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition ${
                    product.active ? "right-0.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
            <span className="font-semibold">:کردارەکان</span>
          </div>
        </div>
      </div>
    </div>
  );
}
