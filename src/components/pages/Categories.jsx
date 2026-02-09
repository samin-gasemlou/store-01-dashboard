import DashboardLayout from "../layout/DashboardLayout";
import Sidebar from "../layout/Sidebar";
import TopBar from "../layout/TopBar";
import CategoriesTable from "../sections/categories/CategoriesTable";
import AddCategoryForm from "../sections/categories/AddCategoryForm";

export default function Categories() {
  return (
    <DashboardLayout topbar={<TopBar />} sidebar={<Sidebar />}>
      <div className="p-4 sm:p-6 lg:mt-4 md:mt-18 mt-16 sm:mt-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 sm:gap-6">
        <CategoriesTable />
        <AddCategoryForm />
      </div>
    </DashboardLayout>
  );
}
