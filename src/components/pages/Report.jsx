import DashboardLayout from "../layout/DashboardLayout";
import TopBar from "../layout/TopBar";
import Sidebar from "../layout/Sidebar";
import SalesChart from "../charts/SalesChart";
import ReportsHeader from "../sections/report/ReportsHeader";
import Boxes from "../sections/report/Boxes";
export default function Report() {
  return (
    <DashboardLayout topbar={<TopBar />} sidebar={<Sidebar />}>
      <div className="lg:mt-12 mt-22">
    <ReportsHeader/>
    <SalesChart />
    <Boxes />
    <Boxes />
    <Boxes />
</div>

    </DashboardLayout>
  );
}
