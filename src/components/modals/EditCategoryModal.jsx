import { useEffect, useMemo, useState } from "react";
import BaseModal from "../ui/BaseModal";
import { ChevronDown } from "lucide-react";
import {
  updateCategory,
  deleteCategory,
  fetchCategories,
} from "../../services/categories.service.js";

const EditCategoryModal = ({ isOpen, onClose, category, onSaved, onDeleted }) => {
  const [form, setForm] = useState({
    name_en: "",
    name_ar: "",
    name_kur: "",
    image: "",
    parentId: "",
  });

  const [loadingParents, setLoadingParents] = useState(false);
  const [parents, setParents] = useState([]);

  const handle = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // کاتێک مۆداڵ دەکرێتەوە: فۆرم پڕ بکە
  useEffect(() => {
    if (!isOpen) return;

    setForm({
      name_en: category?.name_en || "",
      name_ar: category?.name_ar || "",
      name_kur: category?.name_kur || "",
      image: category?.image || "",
      parentId: category?.parentId ? String(category.parentId) : "",
    });
  }, [isOpen, category]);

  // کاتێک مۆداڵ دەکرێتەوە: لیستی دایکەکان بهێنە
  useEffect(() => {
    if (!isOpen) return;

    let alive = true;

    const loadParents = async () => {
      try {
        setLoadingParents(true);
        const out = await fetchCategories({ page: 1, limit: 500 });
        const data = Array.isArray(out?.data) ? out.data : [];
        if (!alive) return;

        // خۆی لە لیستی دایکەکان لاببە
        const filtered = category?._id
          ? data.filter((c) => String(c._id) !== String(category._id))
          : data;

        setParents(filtered);
      } catch (e) {
        console.error(e);
        if (alive) setParents([]);
      } finally {
        if (alive) setLoadingParents(false);
      }
    };

    loadParents();
    return () => {
      alive = false;
    };
  }, [isOpen, category?._id]);

  const parentOptions = useMemo(() => {
    return parents.map((c) => ({
      value: String(c._id),
      label: c.name_en || "—",
    }));
  }, [parents]);

  const onSave = async () => {
    if (!category?._id) return;

    if (!form.name_en || form.name_en.trim().length < 2) {
      alert("ناوی سەرەکی (ئینگلیزی) پێویستە");
      return;
    }

    const parentIdToSend = form.parentId ? form.parentId : null;

    try {
      await updateCategory(category._id, {
        name_en: form.name_en.trim(),
        name_ar: form.name_ar || "",
        name_kur: form.name_kur || "",
        image: form.image || "",
        parentId: parentIdToSend,
      });

      onSaved?.();
      onClose?.();
      alert("دەستکاریکردن بە سەرکەوتوویی ئەنجامدرا.");
    } catch (e) {
      alert(e?.message || "دەستکاریکردن سەرکەوتوو نەبوو");
    }
  };

  const onRemove = async () => {
    if (!category?._id) return;
    if (!confirm("بسڕدرێتەوە؟")) return;

    try {
      await deleteCategory(category._id);
      onDeleted?.();
      onClose?.();
      alert("سڕایەوە.");
    } catch (e) {
      alert(e?.message || "سڕینەوە سەرکەوتوو نەبوو");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="دەستکاریکردنی پۆل" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 flex flex-col items-start justify-center gap-2">
          <label className="text-sm font-semibold text-slate-700">ناوی سەرەکی (ئینگلیزی)</label>
          <input
            type="text"
            value={form.name_en}
            onChange={(e) => handle("name_en", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-left"
          />
        </div>

        <div className="space-y-2 flex flex-col items-start justify-center gap-2">
          <label className="text-sm font-semibold text-slate-700">ناوی عەرەبی</label>
          <input
            type="text"
            value={form.name_ar}
            onChange={(e) => handle("name_ar", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-right"
          />
        </div>

        <div className="space-y-2 w-full flex flex-col items-start justify-center gap-2">
          <label className="text-sm font-semibold text-slate-700">ناوی کوردی:</label>
          <input
            type="text"
            value={form.name_kur}
            onChange={(e) => handle("name_kur", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-right"
          />
        </div>

        {/* Parent select */}
        <div className="space-y-2 flex flex-col items-start justify-center gap-2">
          <label className="text-sm font-semibold text-slate-700">پۆلی دایک:</label>
          <div className="relative w-full">
            <select
              value={form.parentId}
              onChange={(e) => handle("parentId", e.target.value)}
              disabled={loadingParents}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg appearance-none bg-white"
            >
              <option value="">—</option>
              {parentOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Image */}
        <div className="md:col-span-2 flex justify-start items-end gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">وێنەی پۆل:</label>

            <div className="w-24 h-24 border rounded-lg p-2 flex items-center justify-center bg-white relative overflow-hidden">
              <img src={form.image || "/path-to-image.png"} className="max-h-full" alt="cat" />
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = () => handle("image", String(r.result || ""));
                  r.readAsDataURL(f);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6 justify-center md:justify-end">
        <button onClick={onSave} className="px-8 py-2.5 bg-slate-800 text-white rounded-lg">
          پاشەکەوتکردن
        </button>
        <button onClick={onRemove} className="px-8 py-2.5 bg-slate-400 text-white rounded-lg">
          سڕینەوە
        </button>
      </div>
    </BaseModal>
  );
};

export default EditCategoryModal;
