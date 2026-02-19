// dashboard/src/components/sections/categories/CategoriesTable.jsx
import { useEffect, useMemo, useState } from "react";
import CategoryRow from "./CategoryRow";
import MobileCategoryRow from "./MobileCategoryRow";
import EditCategoryModal from "../../modals/EditCategoryModal";
import { fetchCategories, deleteCategory } from "../../../services/categories.service.js";

export default function CategoriesTable() {
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const rows = useMemo(() => categories, [categories]);

  const load = async () => {
    try {
      setLoading(true);
      const out = await fetchCategories({ page: 1, limit: 200 });
      setCategories(Array.isArray(out?.data) ? out.data : []);
    } catch (e) {
      console.error(e);
      alert(e?.message || "وەرگرتنی لیستی پۆلەکان سەرکەوتوو نەبوو");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onEdit = (cat) => {
    setSelected(cat);
    setEditOpen(true);
  };

  const onDelete = async (cat) => {
    if (!cat?._id) return;
    if (!confirm("بسڕدرێتەوە؟")) return;

    const snapshot = categories;
    setCategories((p) => p.filter((x) => x._id !== cat._id));

    try {
      await deleteCategory(cat._id);
    } catch (e) {
      setCategories(snapshot);
      alert(e?.message || "سڕینەوە سەرکەوتوو نەبوو");
    }
  };

  return (
    <div className="bg-white border border-[#0000000D] rounded-2xl shadow-sm p-4 sm:p-6">
      <h2 className="text-right text-[#273959] font-bold text-[18px] sm:text-[20px] mb-4 sm:mb-6">
        لیستی پۆلەکان
      </h2>

      {/* DESKTOP */}
      <div className="hidden md:block min-w-150">
        <div className="flex justify-between text-[14px] sm:text-[15px] font-extrabold pb-3 border-b-2 border-b-[#0000004D] px-4">
          <div className="flex gap-12">
            <span>کردارەکان</span>
            <span>ژمارەی بەرهەمی بەردەست</span>
          </div>
          <div className="flex gap-12">
            <span>ناوی پۆل</span>
            <span>وێنەی پۆل</span>
          </div>
        </div>

        <div className="divide-y px-4">
          {loading ? (
            <div className="py-6 text-center text-sm text-gray-500">لە حالەتی وەرگرتندا...</div>
          ) : (
            rows.map((cat) => (
              <CategoryRow
                key={cat._id}
                category={cat}
                onEdit={() => onEdit(cat)}
                onDelete={() => onDelete(cat)}
              />
            ))
          )}
        </div>
      </div>

      {/* MOBILE & TABLET */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <div className="py-6 text-center text-sm text-gray-500">لە حالەتی وەرگرتندا...</div>
        ) : (
          rows.map((cat) => (
            <MobileCategoryRow
              key={cat._id}
              category={cat}
              onEdit={() => onEdit(cat)}
              onDelete={() => onDelete(cat)}
            />
          ))
        )}
      </div>

      {/* ✅ Edit Modal */}
      <EditCategoryModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        category={selected}
        onSaved={load}
        onDeleted={load}
      />
    </div>
  );
}
