import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import ReportListModal from "../../modals/ReportModal";
import { fetchReportsSummaryBySelectedDate } from "../../../lib/reportsApi.js";

export default function Boxes({ title = "کاڵاکانی زۆرفرۆش", type = "product", selectedDate = "ئەمڕۆ" }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetchReportsSummaryBySelectedDate(selectedDate);
        if (!alive) return;

        if (type === "product") setItems(Array.isArray(res?.topProducts) ? res.topProducts : []);
        else if (type === "customer") setItems(Array.isArray(res?.topCustomers) ? res.topCustomers : []);
        else if (type === "category") setItems(Array.isArray(res?.topCategories) ? res.topCategories : []);
        else setItems([]);
      } catch (e) {
        console.error("fetch report box failed:", e);
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedDate, type]);

  const data = useMemo(() => {
    if (type === "product") {
      return (items || []).map((x, idx) => ({
        id: String(x?.id || x?._id || `p-${idx}`),
        title: x?.title || x?.name || "—",
        salesCount: Number(x?.salesCount ?? 0),
        totalSales: Number(x?.totalSales ?? 0),
        netProfit: Number(x?.netProfit ?? 0),
      }));
    }

    if (type === "customer") {
      return (items || []).map((x, idx) => ({
        id: String(x?.userId || `c-${idx}`),
        username: x?.name || x?.phone || "—",
        salesCount: Number(x?.orders ?? 0),
        totalSales: Number(x?.total ?? 0),
        netProfit: 0,
      }));
    }

    if (type === "category") {
      return (items || []).map((x, idx) => ({
        id: String(x?.categoryId || x?._id || `g-${idx}`),
        name: x?.name || x?.title || "—",
        salesCount: Number(x?.salesCount ?? 0),
        totalSales: Number(x?.totalSales ?? 0),
        netProfit: Number(x?.netProfit ?? 0),
      }));
    }

    return [];
  }, [items, type]);

  const top10 = data.slice(0, 10);
  const hasMore = data.length > 10;

  const getLink = () => {
    if (type === "product") return "/products";
    if (type === "customer") return "/users";
    if (type === "category") return "/products/categories";
    return "#";
  };

  const handleDownloadExcel = () => {
    const excelData = data.map((item) => ({
      "ناونیشان": item.title ?? item.name ?? item.username,
      "ژمارە": item.salesCount,
      "کۆی گشتی (IQD)": item.totalSales,
      "قازانج (IQD)": item.netProfit,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(workbook, `${title}.xlsx`);
  };

  return (
    <>
      <section className="bg-white rounded-2xl shadow-sm p-6 w-full mt-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-[10px] bg-[#2A3E6326] text-[#2A3E63] border border-[#27375626]"
            type="button"
          >
            <img src="/import.svg" alt="" />
            Excel
          </button>

          <h3 className="text-[20px] font-semibold text-[#273959]">{title}</h3>
        </div>

        <div className="hidden lg:block">
          <div className="grid grid-cols-4 text-sm border-b border-b-[#0000000D] pb-3 mb-4">
            <span className="text-left font-extrabold">ژمارە</span>
            <span className="text-left font-extrabold">کۆی گشتی</span>
            <span className="text-left font-extrabold">قازانج</span>
            <span className="text-right font-extrabold">ناونیشان</span>
          </div>

          <div className="max-h-72 overflow-y-auto">
            <ul className="space-y-4">
              {(top10 || []).map((item, idx) => (
                <li
                  key={`${item.id}-${idx}`}
                  className="grid grid-cols-4 items-center text-sm border-b border-b-[#0000000D] pb-3 last:border-none"
                >
                  <span className="text-left">{item.salesCount}</span>
                  <span className="text-left">{Number(item.totalSales || 0).toLocaleString()} IQD</span>
                  <span className="text-left">{Number(item.netProfit || 0).toLocaleString()} IQD</span>

                  <Link to={getLink()} className="text-right hover:text-blue-600">
                    {item.title ?? item.name ?? item.username}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {loading ? (
            <div className="py-3 text-right text-xs text-slate-500">لە حالەتی وەرگرتندا...</div>
          ) : null}

          {hasMore && (
            <div className="flex justify-start mt-4">
              <button
                onClick={() => setModalOpen(true)}
                className="text-sm text-blue-600 hover:underline"
                type="button"
              >
                زیاتر پیشان بدە
              </button>
            </div>
          )}
        </div>

        <div className="lg:hidden">
          <div className="space-y-2">
            {(top10 || []).map((item, idx) => (
              <button
                key={`${item.id}-${idx}`}
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
                type="button"
              >
                زیاتر پیشان بدە
              </button>
            </div>
          )}
        </div>
      </section>

      <ReportListModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={title}
        items={data}
        type={type}
        loading={loading}
      />
    </>
  );
}
