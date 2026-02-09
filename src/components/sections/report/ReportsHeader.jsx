import { useState } from "react";
import { ChevronDown } from "lucide-react";
import * as XLSX from "xlsx";

// 🔹 دیتای نمونه (بعداً می‌تونی از API بگیری)
const reportData = {
  "گزارشات امروز": [
    { title: "ادکلن مردانه d300", sales: 3, total: 4200000, profit: 1200000 },
  ],
  "گزارشات ماهانه": [
    { title: "ادکلن مردانه d300", sales: 16, total: 22400000, profit: 6400000 },
    { title: "کرم آبرسان کودکان", sales: 13, total: 16900000, profit: 5100000 },
  ],
  "گزارشات سالانه": [
    { title: "ادکلن مردانه d300", sales: 45, total: 72000000, profit: 21000000 },
    { title: "ماسک مو مدل هرمس", sales: 32, total: 48000000, profit: 14000000 },
  ],
};

export default function ReportsHeader() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("گزارشات امروز");

  const options = [
    "گزارشات امروز",
    "گزارشات ماهانه",
    "گزارشات سالانه",
  ];

  // ✅ دانلود واقعی اکسل
  const handleDownloadExcel = () => {
    const data = reportData[type] || [];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

    XLSX.writeFile(
      workbook,
      `${type.replaceAll(" ", "_")}.xlsx`
    );
  };

  return (
    <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
      
      {/* LEFT */}
      <button
        onClick={handleDownloadExcel}
        className="px-5 lg:px-9 py-2.5 lg:py-3 rounded-[10px] bg-[#2A3E6326] text-[#2A3E63] text-[12px] sm:text-[13px] lg:text-[14px] font-medium flex items-center justify-center gap-1 w-full lg:w-auto"
      >
        <img src="/import.svg" alt="" />
        Excel all reports
      </button>

      {/* RIGHT */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 relative w-full lg:w-auto">

        {/* DATE RANGE */}
        <span className="text-[11px] w-full text-center md:text-right sm:text-[12px] lg:text-sm text-gray-500 whitespace-nowrap">
          از تاریخ 1404/11/23 تا تاریخ 1404/11/30
        </span>

        {/* REPORT TYPE */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between gap-2 px-4 lg:px-6 md:px-16 py-2.5 lg:py-3 rounded-[1000px] md:rounded-2xl bg-[#68748A] text-white text-[12px] sm:text-[13px] lg:text-[14px] font-medium w-full sm:w-auto"
        >
          <ChevronDown size={14} className="lg:w-4 lg:h-4" />
          {type}
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute top-full mt-2 right-0 w-full sm:w-44 bg-white rounded-xl shadow-lg border z-10">
            {options.map((item) => (
              <div
                key={item}
                onClick={() => {
                  setType(item);
                  setOpen(false);
                }}
                className="px-4 py-2 text-[12px] sm:text-sm cursor-pointer hover:bg-gray-100 rounded-xl text-center"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
