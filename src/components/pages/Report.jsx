import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import TopBar from "../layout/TopBar";
import Sidebar from "../layout/Sidebar";
import SalesChart from "../charts/SalesChart";
import ReportsHeader from "../sections/report/ReportsHeader";
import Boxes from "../sections/report/Boxes";

export default function Report() {
  const [selectedDate, setSelectedDate] = useState("ئەمڕۆ");

  return (
    <DashboardLayout topbar={<TopBar />} sidebar={<Sidebar />}>
      <div className="lg:mt-12 mt-22">
        <ReportsHeader selectedDate={selectedDate} onChangeDate={setSelectedDate} />

        {/* ✅ فقط همین */}
        <SalesChart selectedDate={selectedDate} />

        <Boxes title="کاڵاکانی زۆرفرۆش" type="product" selectedDate={selectedDate} />
        <Boxes title="کڕیارە باشترەکان" type="customer" selectedDate={selectedDate} />
        <Boxes title="پۆلە باشترەکان" type="category" selectedDate={selectedDate} />
      </div>
    </DashboardLayout>
  );
}
