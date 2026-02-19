// dashboard/src/components/sections/home/TopProductsD.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchTopProducts } from "../../../lib/dashboardApi.js";
import { topProducts as mockTopProducts } from "./topProductsData";

export default function TopProducts() {
  const [data, setData] = useState(Array.isArray(mockTopProducts) ? mockTopProducts : []);
  const [loading, setLoading] = useState(true);

  const rows = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    return arr.slice(0, 6);
  }, [data]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const rowsApi = await fetchTopProducts(6);
        if (alive && Array.isArray(rowsApi) && rowsApi.length) {
          setData(rowsApi);
        }
      } catch (e) {
        console.error("fetchTopProducts failed:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const exportToExcel = () => {
    const headers = ["ناونیشان", "ژمارەی فرۆشتن"];
    const csvRows = rows.map((item) => [String(item.title ?? ""), String(item.count ?? 0)]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      csvRows.map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "top-products.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2
          text-[12px] sm:text-[13px] md:text-sm
          px-4 py-2 rounded-[10px] bg-[#2A3E6326] text-[#2A3E63] border border-[#27375626]"
          type="button"
          disabled={!rows.length}
        >
          <img src="/import.svg" alt="" />
          Excel
        </button>

        <h3 className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-[#273959]">
          کاڵاکانی زۆرفرۆش
        </h3>
      </div>

      {loading ? (
        <div className="text-[#273959] text-[12px] sm:text-[13px] opacity-60">
          لە حالەتی وەرگرتنی زانیاری...
        </div>
      ) : null}

      <ul className="space-y-4">
        {rows.map((item, idx) => (
          <li
            key={String(item?.id ?? idx)}
            className="flex items-center justify-between border-b border-b-[#0000000D] pb-3 last:border-none"
          >
            <span className="font-bold text-[12px] sm:text-[13px] md:text-[14px] w-[45%] whitespace-nowrap">
              {Number(item?.count ?? 0).toLocaleString()} فرۆشتن
            </span>

            <span className="font-bold text-[12px] sm:text-[13px] md:text-[14px] text-right w-[55%] truncate">
              {item?.title ?? "—"}
            </span>
          </li>
        ))}

        {!rows.length && !loading ? (
          <li className="text-[#273959] text-[12px] sm:text-[13px] opacity-60">
            هیچ داتایەک بۆ پیشاندان نییە
          </li>
        ) : null}
      </ul>
    </section>
  );
}
