import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import ReportListModal from "../../modals/ReportModal";
import { salesData } from "./topProductsData";

export default function Boxes({ title = "کالاهای پرفروش", type = "product" }) {
  const [modalOpen, setModalOpen] = useState(false);

  // ✅ اینجا بعداً بر اساس selectedDate از API می‌گیری
  const data = useMemo(() => {
    if (type === "product") return salesData;
    if (type === "customer")
      return salesData.map((x) => ({ ...x, username: x.title, title: undefined }));
    if (type === "category")
      return salesData.map((x) => ({ ...x, name: x.title, title: undefined }));
    return salesData;
  }, [type]);

  const top10 = data.slice(0, 10);
  const hasMore = data.length > 10;

  const getLink = () => {
    if (type === "product") return `/products`;
    if (type === "customer") return `/users`;
    if (type === "category") return `/products/categories`;
    return "#";
  };

  const handleDownloadExcel = () => {
    const excelData = data.map((item) => ({
      "عنوان": item.title ?? item.name ?? item.username,
      "تعداد": item.salesCount,
      "مجموع (IQD)": item.totalSales,
      "سود (IQD)": item.netProfit,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(workbook, `${title}.xlsx`);
  };

  return (
    <>
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

          <h3 className="text-[20px] font-semibold text-[#273959]">{title}</h3>
        </div>

        {/* ✅ DESKTOP: scroll + فقط ۱۰ تا */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 text-sm border-b border-b-[#0000000D] pb-3 mb-4">
            <span className="text-left font-extrabold">تعداد</span>
            <span className="text-left font-extrabold">مجموع</span>
            <span className="text-left font-extrabold">سود</span>
            <span className="text-right font-extrabold">عنوان</span>
          </div>

          <div className="max-h-72 overflow-y-auto">
            <ul className="space-y-4">
              {top10.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-4 items-center text-sm border-b border-b-[#0000000D] pb-3 last:border-none"
                >
                  <span className="text-left">{item.salesCount}</span>
                  <span className="text-left">{item.totalSales.toLocaleString()} IQD</span>
                  <span className="text-left">{item.netProfit.toLocaleString()} IQD</span>

                  <Link to={getLink(item)} className="text-right hover:text-blue-600">
                    {item.title ?? item.name ?? item.username}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {hasMore && (
            <div className="flex justify-start mt-4">
              <button
                onClick={() => setModalOpen(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                نمایش بیشتر
              </button>
            </div>
          )}
        </div>

        {/* ✅ MOBILE: فقط نام‌ها (کلیک => مودال) */}
        <div className="lg:hidden">
          <div className="space-y-2">
            {top10.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setModalOpen(true)}
                className="w-full text-right p-3 rounded-xl border border-[#0000000D] hover:bg-slate-50 transition"
              >
                {item.title ?? item.name ?? item.username}
              </button>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-start mt-4">
              <button
                onClick={() => setModalOpen(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                نمایش بیشتر
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ✅ Modal list full */}
      <ReportListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={title}
        items={data}
        type={type}
      />
    </>
  );
}
