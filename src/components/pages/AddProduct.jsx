import AddProductForm from "../sections/products/AddProductForm";
import DashboardLayout from "../layout/DashboardLayout";
import Sidebar from "../layout/Sidebar";
import TopBar from "../layout/TopBar";
export default function AddProduct() {
  return (
    <DashboardLayout topbar={<TopBar />} sidebar={<Sidebar />}>
      <div className="flex-1 w-full flex flex-col mt-20 md:mt-20">
       <AddProductForm />
      </div>
    </DashboardLayout>
  )
}
