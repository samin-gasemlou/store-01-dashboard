import DashboardLayout from "../layout/DashboardLayout";
import Sidebar from "../layout/Sidebar";
import TopBar from "../layout/TopBar";
import OrdersTable from "../sections/orders/OrdersTable";

export default function Orders() {
  return (
    <DashboardLayout topbar={<TopBar />} sidebar={<Sidebar />}>
      <div className="bg-white rounded-2xl shadow-sm p-6 mt-16 md:mt-24 lg:mt-12">
        <OrdersTable />
        
      </div>
    </DashboardLayout>
  );
}
