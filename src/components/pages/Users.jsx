import DashboardLayout from "../layout/DashboardLayout";
import TopBar from "../layout/TopBar";
import Sidebar from "../layout/Sidebar";
import UsersTable from "../sections/users/UsersTable";
export default function Users() {
  return (
    <DashboardLayout topbar={<TopBar />} sidebar={<Sidebar />}>
      <div className="lg:mt-12 mt-22 md:mt-24">
    <UsersTable />
</div>

    </DashboardLayout>
  );
}

