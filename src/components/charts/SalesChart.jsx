// dashboard/src/components/charts/SalesChart.jsx
import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { fetchReportsSummaryBySelectedDate } from "../../lib/reportsApi.js";

export default function SalesChart({ selectedDate = "امروز" }) {
  const fallback = useMemo(
    () => [
      { day: "شنبه", value: 2800000 },
      { day: "یکشنبه", value: 3000000 },
      { day: "دوشنبه", value: 3100000 },
      { day: "سه‌شنبه", value: 3300000 },
      { day: "چهارشنبه", value: 3700000 },
      { day: "پنج‌شنبه", value: 8500000 },
      { day: "جمعه", value: 7000000 },
    ],
    []
  );

  const [data, setData] = useState(fallback);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetchReportsSummaryBySelectedDate(selectedDate);
        if (!alive) return;

        const rows = res?.salesLast7Days;
        if (Array.isArray(rows) && rows.length) setData(rows);
        else setData(fallback);
      } catch (e) {
        console.error("fetch salesLast7Days failed:", e);
        if (alive) setData(fallback);
      }
    })();

    return () => {
      alive = false;
    };
  }, [fallback, selectedDate]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 text-right">
     

      <div className="h-[260px] sm:h-[320px] text-[12px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#273756" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#2737560D" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#273756"
              fill="url(#colorSales)"
              strokeWidth={0.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
