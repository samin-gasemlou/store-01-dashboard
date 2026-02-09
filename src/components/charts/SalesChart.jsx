import { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function SalesChart() {
  const data = useMemo(() => ([
    { day: "شنبه", value: 2800000 },
    { day: "یکشنبه", value: 3000000 },
    { day: "دوشنبه", value: 3100000 },
    { day: "سه‌شنبه", value: 3300000 },
    { day: "چهارشنبه", value: 3700000 },
    { day: "پنج‌شنبه", value: 8500000 },
    { day: "جمعه", value: 7000000 },
  ]), []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 text-right">
      <h3 className="text-[20px] text-[#273959] font-semibold mb-4">
        نمودار فروش 7 روز گذشته
      </h3>

      <div className="h-65 text-[12px]">
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
