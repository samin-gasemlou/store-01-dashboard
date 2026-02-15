// dashboard/src/components/pages/Dashboard.jsx
import { useMemo, useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import TopBar from "../layout/TopBar";
import Sidebar from "../layout/Sidebar";
import StatCard from "../stats/StatCard";
import SalesChart from "../charts/SalesChart";
import OrdersTableD from "../sections/home/OrdersTableD";
import TopProducts from "../sections/home/TopProductsD";

import { apiClient } from "../../lib/apiClient.js";
import { fetchDashboardStats } from "../../lib/dashboardApi.js";

export default function Dashboard() {
  const [statsApi, setStatsApi] = useState(null);

  const stats = useMemo(() => {
    const fallback = [
      { id: 1, title: "سفارش جدید", value: 16, action: true },
      { id: 2, title: "سود خالص امروز", value: "6,700,000 IQD" },
      { id: 3, title: "فروش امروز", value: "13,900,000 IQD" },
    ];

    if (!statsApi) return fallback;

    return [
      { id: 1, title: "سفارش جدید", value: statsApi.newOrders ?? 0, action: true },
      { id: 2, title: "سود خالص امروز", value: `${Number(statsApi.netProfitToday ?? 0).toLocaleString()} IQD` },
      { id: 3, title: "فروش امروز", value: `${Number(statsApi.salesToday ?? 0).toLocaleString()} IQD` },
    ];
  }, [statsApi]);

useEffect(() => {
  (async () => {
    try {
      const res = await apiClient("/health", { method: "GET" });
      console.log("HEALTH:", res);
    } catch (e) {
      console.error(e);
    }
  })();
}, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const s = await fetchDashboardStats();
        if (alive) setStatsApi(s);
      } catch (e) {
        console.error("fetchDashboardStats failed:", e);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <DashboardLayout topbar={<TopBar />} sidebar={<Sidebar />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 md:gap-6 gap-0 md:mb-6 mb-4 lg:mt-6 md:mt-20 mt-12">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            action={stat.action}
            onAction={() => console.log("STAT ACTION:", stat.title)}
          />
        ))}
      </div>

      <SalesChart />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <OrdersTableD />
        <TopProducts />
      </div>
    </DashboardLayout>
  );
}
