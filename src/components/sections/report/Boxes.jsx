import { useState } from "react";
import { ChevronDown } from "lucide-react";
import * as XLSX from "xlsx";
import { salesData } from "./topProductsData";

export default function Boxes() {
  const [openIndex, setOpenIndex] = useState(null);
  // ✅ دانلود واقعی اکسل
  const handleDownloadExcel = () => {
    const excelData = salesData.map(item => ({
      "عنوان کالا": item.title,
      "تعداد فروش": item.salesCount,
      "مجموع فروش (IQD)": item.totalSales,
      "سود خالص (IQD)": item.netProfit,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Top Products");

    XLSX.writeFile(workbook, "top-products.xlsx");
  };


  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 w-full mt-8">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleDownloadExcel}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-[10px] bg-[#2A3E6326] text-[#2A3E63] border border-[#27375626]"
        >
          <img src="/import.svg" alt="" />
          Excel
        </button>

        <h3 className="text-[20px] font-semibold text-[#273959]">
          کالاهای پرفروش
        </h3>
      </div>

      {/* ===== DESKTOP TABLE (UNCHANGED) ===== */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-4 text-sm border-b border-b-[#0000000D] pb-3 mb-4">
          <span className="text-left font-extrabold">تعداد فروش</span>
          <span className="text-left font-extrabold">مجموع فروش</span>
          <span className="text-left font-extrabold">سود خالص</span>
          <span className="text-right font-extrabold">عنوان</span>
        </div>

        <ul className="space-y-4">
          {salesData.map((item) => (
            <li
              key={item.id}
              className="grid grid-cols-4 items-center text-sm border-b border-b-[#0000000D] pb-3 last:border-none"
            >
              <span className="text-left">{item.salesCount} فروش</span>
              <span className="text-left">{item.totalSales.toLocaleString()} IQD</span>
              <span className="text-left">{item.netProfit.toLocaleString()} IQD</span>
              <span className="text-right">{item.title}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ===== MOBILE & TABLET ACCORDION ===== */}
      <ul className="lg:hidden space-y-3">
        {salesData.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <li
              key={item.id}
              className="border border-[#0000000D] rounded-xl overflow-hidden"
            >
              {/* TITLE */}
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between px-4 py-3 text-right text-[14px] font-medium"
              >
                {item.title}
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* DETAILS */}
              <div
                className={`grid grid-cols-1 gap-2 px-4 overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex justify-between text-[13px]">
                  <span>تعداد فروش</span>
                  <span>{item.salesCount} فروش</span>
                </div>

                <div className="flex justify-between text-[13px]">
                  <span>مجموع فروش</span>
                  <span>{item.totalSales.toLocaleString()} IQD</span>
                </div>

                <div className="flex justify-between text-[13px]">
                  <span>سود خالص</span>
                  <span>{item.netProfit.toLocaleString()} IQD</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
