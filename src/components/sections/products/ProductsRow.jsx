import { Trash2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductsRow({ product, toggleActive, deleteProduct }) {
  const navigate = useNavigate(); // ✅ اضافه شد

  const stockStatus =
    product.stock === 0
      ? "نا موجود"
      : product.stock < 10
      ? "کم"
      : "موجود";

  // وقتی روی آیکون تنظیمات کلیک شد، صفحه افزودن محصول باز شود
  const goToAddProduct = () => {
    navigate("/products/add");
  };

  return (
    <tr className="border-b-2 border-b-[#0000000D] last:border-none text-gray-700 text-[12px] sm:text-[13px] md:text-sm">
      {/* ACTIONS */}
      <td className="flex justify-start py-2 sm:py-4">
        <div className="flex items-center gap-2 justify-end px-2">
          {/* Settings */}
          <button onClick={goToAddProduct}>
            <Settings size={18} className="text-gray-600 cursor-pointer" />
          </button>

          {/* Delete */}
          <button onClick={() => deleteProduct(product.id)}>
            <Trash2 size={18} className="text-red-500 cursor-pointer" />
          </button>

          {/* Toggle Active */}
          <button
            onClick={() => toggleActive(product.id)}
            className={`w-9 h-5 rounded-full relative transition ${product.active ? "bg-green-500" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${product.active ? "right-0.5" : "right-4"}`}
            />
          </button>
        </div>
      </td>

      <td className="py-2 sm:py-4 align-middle">{product.expire}</td>
      <td className="py-2 sm:py-4 align-middle">
        <span className="text-xs mr-1 text-gray-400">({stockStatus})</span>
        {product.stock} عدد
      </td>
      <td className="py-2 sm:py-4 align-middle">{product.price}</td>
      <td className="py-2 sm:py-4 align-middle">{product.name}</td>
      <td className="py-2 sm:py-4 align-middle">
        <div className="flex justify-end">
          <img
            src={product.img}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-black"
            alt={product.name}
          />
        </div>
      </td>
    </tr>
  );
}
