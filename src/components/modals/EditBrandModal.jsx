import { useEffect, useMemo, useState } from "react";
import BaseModal from "../ui/BaseModal";
import { ChevronDown } from "lucide-react";
import { updateBrand, deleteBrand } from "../../services/brands.service.js";
import { fetchCategories } from "../../services/categories.service.js";

function unwrapApi(res) {
  if (!res) return null;
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
}

export default function EditBrandModal({ isOpen, onClose, brand, onSaved, onDeleted }) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loadingCats, setLoadingCats] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    setName(brand?.name || "");
    setCategoryId(String(brand?.categoryId || ""));
  }, [isOpen, brand]);

  useEffect(() => {
    if (!isOpen) return;
    let alive = true;

    const loadCats = async () => {
      try {
        setLoadingCats(true);
        const out = await fetchCategories({ page: 1, limit: 500 });
        const data = unwrapApi(out);
        const list = Array.isArray(data) ? data : [];
        if (!alive) return;
        setCategories(list);
      } catch (e) {
        console.error(e);
        if (alive) setCategories([]);
      } finally {
        if (alive) setLoadingCats(false);
      }
    };

    loadCats();
    return () => {
      alive = false;
    };
  }, [isOpen]);

  const categoryOptions = useMemo(() => {
    const parents = categories.filter((c) => !c?.parentId);
    return parents
      .map((c) => ({
        value: String(c?._id || ""),
        label: c?.name_en || c?.name_ar || c?.name_kur || "—",
      }))
      .filter((x) => x.value);
  }, [categories]);

  const onSave = async () => {
    if (!brand?._id) return;

    if (!name || name.trim().length < 2) return alert("ناوی براند پێویستە");
    if (!categoryId) return alert("پۆلی دایکی پێویستە");

    try {
      await updateBrand(brand._id, {
        name: name.trim(),
        categoryId,
        sortAlphabet: "",
      });

      onSaved?.();
      onClose?.();
      alert("دەستکاریکردن بە سەرکەوتوویی ئەنجامدرا.");
    } catch (e) {
      console.error(e);
      alert(e?.message || "دەستکاریکردن سەرکەوتوو نەبوو");
    }
  };

  const onRemove = async () => {
    if (!brand?._id) return;
    if (!confirm("بسڕدرێتەوە؟")) return;

    try {
      await deleteBrand(brand._id);
      onDeleted?.();
      onClose?.();
      alert("سڕایەوە.");
    } catch (e) {
      console.error(e);
      alert(e?.message || "سڕینەوە سەرکەوتوو نەبوو");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="دەستکاریکردنی براند" size="md">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">ناوی سەرەکی (ئینگلیزی)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-left"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">پۆلی دایک</label>
          <div className="relative">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loadingCats}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 appearance-none bg-white"
            >
              <option value="">—</option>
              {categoryOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-start gap-4 pt-8">
        <button
          onClick={onSave}
          className="px-8 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900"
        >
          پاشەکەوتکردن
        </button>
        <button
          onClick={onRemove}
          className="px-8 py-2.5 bg-slate-400 text-white rounded-lg hover:bg-slate-500"
        >
          سڕینەوە
        </button>
      </div>
    </BaseModal>
  );
}
