import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import TopBar from "../layout/TopBar";
import Sidebar from "../layout/Sidebar";
import SalesChart from "../charts/SalesChart";
import ReportsHeader from "../sections/report/ReportsHeader";
import Boxes from "../sections/report/Boxes";

export default function Report() {
  const [selectedDate, setSelectedDate] = useState("امروز");

  return (
    <DashboardLayout topbar={<TopBar />} sidebar={<Sidebar />}>
      <div className="lg:mt-12 mt-22">
        <ReportsHeader selectedDate={selectedDate} onChangeDate={setSelectedDate} />

        <SalesChart />

        {/* سه بخش */}
        <Boxes title="کالاهای پرفروش" type="product" selectedDate={selectedDate} />
        <Boxes title="مشتریان برتر" type="customer" selectedDate={selectedDate} />
        <Boxes title="دسته بندی های برتر" type="category" selectedDate={selectedDate} />
      </div>
    </DashboardLayout>
  );
}
