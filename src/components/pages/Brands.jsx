import DashboardLayout from "../layout/DashboardLayout";
import Sidebar from "../layout/Sidebar";
import TopBar from "../layout/TopBar";
import BrandsTable from "../sections/brands/BrandsTable";
import AddBrandForm from "../sections/brands/AddBrandForm";

export default function Brands() {
  return (
    <DashboardLayout topbar={<TopBar />} sidebar={<Sidebar />}>
      <div className="p-4 sm:p-6 lg:mt-4 md:mt-18 mt-12 sm:mt-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 sm:gap-6">
        <BrandsTable />
        <AddBrandForm />
      </div>
    </DashboardLayout>
  );
}
