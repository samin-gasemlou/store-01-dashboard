import { useState } from "react";
import { ChevronDown, Settings, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MobileProductRow({ product, toggleActive, deleteProduct }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const stockStatus =
    product.stock === 0 ? "نا موجود" : product.stock < 10 ? "کم" : "موجود";

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      
      {/* Header */}
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-4 py-4 text-right"
      >
         <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        <span className="font-bold text-sm">{product.name}</span>
       
      </button>

      {/* Content */}
<div
  className={`transition-all duration-300 ease-in-out overflow-hidden ${
    open
      ? "max-h-250 opacity-100"
      : "max-h-0 opacity-0 pointer-events-none"
  }`}
>
  <div className="px-4 pb-4 text-xs space-y-3">

    {/* Image */}
    <div className="flex justify-between items-center">
      <img src={product.img} className="w-12 h-12 rounded-lg bg-black" />
      <span className="font-semibold">:تصویر</span>
    </div>

    {/* Expire */}
    <div className="flex justify-between">
      <span>{product.expire}</span>
      <span className="font-semibold">:تاریخ انقضا</span>
    </div>

    {/* Stock */}
    <div className="flex justify-between">
      <span>
        {product.stock} عدد
        <span className="text-gray-400 mr-1">({stockStatus})</span>
      </span>
      <span className="font-semibold">:موجودی</span>
    </div>

    {/* Price */}
    <div className="flex justify-between">
      <span>{product.price}</span>
      <span className="font-semibold">:قیمت فروش</span>
    </div>

    {/* Actions */}
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/products/add")}>
          <Settings size={16} />
        </button>
        <button onClick={() => deleteProduct(product.id)}>
          <Trash2 size={16} className="text-red-500" />
        </button>
        <button
          onClick={() => toggleActive(product.id)}
          className={`w-8 h-4 rounded-full relative transition ${
            product.active ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition ${
              product.active ? "right-0.5" : "left-0.5"
            }`}
          />
        </button>
      </div>
      <span className="font-semibold">:عملیات</span>
    </div>

  </div>
</div>

    </div>
  );
}
