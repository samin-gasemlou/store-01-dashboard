// dashboard/src/components/sections/home/OrdersTableD.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrdersRow from "./OrdersRow";
import { fetchLatestOrders } from "../../../lib/dashboardApi.js";

export default function OrdersTableD() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/orders");
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const rows = await fetchLatestOrders(6); // ✅ بیشتر لە 6 تا نمایش نده
        if (alive) setOrders(Array.isArray(rows) ? rows.slice(0, 6) : []);
      } catch (e) {
        console.error("fetchLatestOrders failed:", e);
        if (alive) setOrders([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const rowsToShow = useMemo(() => orders.slice(0, 6), [orders]);

  return (
    <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 w-full">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={handleViewAll}
          className="
            text-[12px] sm:text-[13px] md:text-sm
            px-4 py-2 rounded-[10px]
            bg-[#2A3E6326] text-[#2A3E63]
            border border-[#27375626]
            hover:bg-[#2A3E6333]
            transition
          "
          type="button"
        >
          بینین
        </button>

        <h3 className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-[#273959]">
          دوایین داواکارییەکان
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[520px]">
          <thead>
            <tr className="text-center text-[11px] sm:text-[13px] text-[#273959]">
              <th className="py-3 font-semibold">ID</th>
              <th className="py-3 font-semibold">کڕیار</th>
              <th className="py-3 font-semibold">نرخ</th>
              <th className="py-3 font-semibold text-right">دۆخ</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-t-[#0000000D]">
                  <td className="py-4 px-2">
                    <div className="h-3 w-16 bg-gray-100 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-2">
                    <div className="h-3 w-28 bg-gray-100 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-2">
                    <div className="h-3 w-24 bg-gray-100 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-2">
                    <div className="h-3 w-32 bg-gray-100 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : rowsToShow.length === 0 ? (
              <tr className="border-t border-t-[#0000000D]">
                <td colSpan={4} className="py-6 text-sm text-gray-500 text-center">
                  هیچ داواکارییەک بۆ پیشاندان نییە
                </td>
              </tr>
            ) : (
              rowsToShow.map((order) => (
                <OrdersRow key={order._mongoId || order.id} order={order} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
