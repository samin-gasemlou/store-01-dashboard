// dashboard/src/components/pages/Categories.jsx
import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Sidebar from "../layout/Sidebar";
import TopBar from "../layout/TopBar";
import CategoriesTable from "../sections/categories/CategoriesTable";
import AddCategoryForm from "../sections/categories/AddCategoryForm";
import { fetchCategories } from "../../services/categories.service.js";

export default function Categories() {
  const [parentOptions, setParentOptions] = useState([]);

  const loadParents = async () => {
    try {
      const out = await fetchCategories({ page: 1, limit: 500 });
      const arr = Array.isArray(out?.data) ? out.data : [];

      // ✅ فقط دسته‌های اصلی (parentId=null) بۆ انتخاب بعنوان مادر
      const parentsOnly = arr.filter((c) => !c?.parentId);

      setParentOptions(
        parentsOnly.map((c) => ({
          value: c._id,
          label: c.name_en || "-",
        }))
      );
    } catch (e) {
      console.error(e);
      setParentOptions([]);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadParents();
  }, []);

  return (
    <DashboardLayout topbar={<TopBar />} sidebar={<Sidebar />}>
      <div className="p-4 sm:p-6 lg:mt-4 md:mt-18 mt-12 sm:mt-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 sm:gap-6">
        <CategoriesTable />
        <AddCategoryForm
          parentOptions={parentOptions}
          onCreated={() => window.location.reload()}
        />
      </div>
    </DashboardLayout>
  );
}
