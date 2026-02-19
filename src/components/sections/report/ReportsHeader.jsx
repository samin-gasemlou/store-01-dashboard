import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import * as XLSX from "xlsx";

const reportData = {
  today: [{ title: "ادکلن مردانه d300", sales: 3, total: 4200000, profit: 1200000 }],
  monthly: [{ title: "ادکلن مردانه d300", sales: 16, total: 22400000, profit: 6400000 }],
  yearly: [{ title: "ادکلن مردانه d300", sales: 45, total: 72000000, profit: 21000000 }],
};

export default function ReportsHeader({ selectedDate, onChangeDate }) {
  const [open, setOpen] = useState(false);

  const quickDates = useMemo(
    () => [
      { label: "ئەمڕۆ", value: "today" },
      { label: "دوێنێ", value: "yesterday" },
      { label: "٧ ڕۆژی ڕابردوو", value: "last7" },
      { label: "٣٠ ڕۆژی ڕابردوو", value: "last30" },
    ],
    []
  );

  const handleDownloadExcel = () => {
    const data = reportData.today || [];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
    XLSX.writeFile(workbook, `reports.xlsx`);
  };

  const buttonLabel = useMemo(() => {
    const s = String(selectedDate || "").trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `ڕاپۆرتی ${s}`;
    return `ڕاپۆرتی ${s || "ئەمڕۆ"}`;
  }, [selectedDate]);

  return (
    <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
      <button
        onClick={handleDownloadExcel}
        className="px-5 lg:px-9 py-2.5 lg:py-3 rounded-[10px] bg-[#2A3E6326] text-[#2A3E63] text-[12px] sm:text-[13px] lg:text-[14px] font-medium flex items-center justify-center gap-1 w-full lg:w-auto"
        type="button"
      >
        <img src="/import.svg" alt="" />
        Excel ـی هەموو ڕاپۆرتەکان
      </button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 relative w-full lg:w-auto">
        <span className="text-[11px] w-full text-center md:text-right sm:text-[12px] lg:text-sm text-gray-500 whitespace-nowrap">
          ڕێکەوتی هەڵبژێردراو: {selectedDate}
        </span>

        <div
          className="relative w-full sm:w-auto"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button
            className="flex items-center justify-between gap-2 px-4 lg:px-6 md:px-16 py-2.5 lg:py-3 rounded-[1000px] md:rounded-2xl bg-[#68748A] text-white text-[12px] sm:text-[13px] lg:text-[14px] font-medium w-full sm:w-auto"
            type="button"
          >
            <ChevronDown size={14} className="lg:w-4 lg:h-4" />
            {buttonLabel}
          </button>

          {open && (
            <div className="absolute top-full mt-2 right-0 w-full sm:w-56 bg-white rounded-xl shadow-lg border z-10 p-2">
              <div className="space-y-1">
                {quickDates.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => onChangeDate(d.label)}
                    className="w-full px-4 py-2 text-[12px] sm:text-sm hover:bg-gray-100 rounded-xl text-right"
                    type="button"
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="border-t mt-2 pt-2">
                <label className="text-[12px] text-gray-500 block mb-1 text-right">
                  ڕێکەوتی دەستی
                </label>
                <input
                  type="date"
                  onChange={(e) => onChangeDate(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
