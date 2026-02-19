import { Download, ChevronDown } from "lucide-react";
import { useState } from "react";
import SortDropdown from "./SortDropdown";

export default function ProductsHeader({ products, setProducts }) {
  const [open, setOpen] = useState(false);

  const exportToExcel = () => {
    const headers = ["ناوی بەرهەم", "نرخی فرۆشتن", "کۆگا", "ڕێکەوتی بەسەرچوون"];
    const rows = products.map((p) => [p.name, p.price, p.stock, p.expire]);
    let csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "products.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
      <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
        <div className="relative">
          <button
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-1 px-4 py-2 rounded-[10px] border border-[#27375626] text-sm w-auto bg-[#2A3E6326] text-[#2A3E63]"
            type="button"
          >
            <ChevronDown size={16} />
            ڕیزکردن
          </button>
          {open && (
            <SortDropdown
              products={products}
              setProducts={setProducts}
              closeDropdown={() => setOpen(false)}
            />
          )}
        </div>

        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#27375626] text-sm w-auto bg-[#2A3E6326] text-[#2A3E63]"
          type="button"
        >
          <Download size={16} />
          Excel
        </button>
      </div>

      <div className="w-full sm:w-auto mt-2 sm:mt-0 text-center sm:text-left">
        <h2 className="text-lg sm:text-lg md:text-xl font-bold text-gray-800">
          هەموو بەرهەمەکان
        </h2>
      </div>
    </div>
  );
}
