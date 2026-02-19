import { useEffect, useMemo, useState } from "react";
import TextInput from "./TextInput.jsx";
import SelectInput from "./SelectInput.jsx";

import { createBrand } from "../../../services/brands.service.js";
import { fetchCategories } from "../../../services/categories.service.js";

function unwrapApi(res) {
  if (!res) return null;
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
}

export default function AddBrandForm({ onCreated }) {
  const [loadingCats, setLoadingCats] = useState(false);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
  });

  useEffect(() => {
    let alive = true;

    const loadCats = async () => {
      try {
        setLoadingCats(true);
        const out = await fetchCategories({ page: 1, limit: 200 });
        const data = unwrapApi(out);
        const list = Array.isArray(data) ? data : [];
        if (!alive) return;
        setCategories(list);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setCategories([]);
      } finally {
        if (alive) setLoadingCats(false);
      }
    };

    loadCats();
    return () => {
      alive = false;
    };
  }, []);

  const categoryOptions = useMemo(() => {
    const parents = categories.filter((c) => !c?.parentId);
    return parents
      .map((c) => ({
        value: String(c?._id || ""),
        label: c?.name_en || c?.name_ar || c?.name_kur || "—",
      }))
      .filter((x) => x.value);
  }, [categories]);

  const submit = async () => {
    if (!form.name || form.name.trim().length < 2)
      return alert("ناوی براند پێویستە.");
    if (!form.categoryId) return alert("پۆلی دایکی پێویستە.");

    try {
      await createBrand({
        name: form.name.trim(),
        categoryId: form.categoryId,
        sortAlphabet: "",
      });

      setForm({ name: "", categoryId: "" });
      onCreated?.();
      alert("براند بە سەرکەوتوویی دروستکرا.");
    } catch (e) {
      console.error(e);
      alert(e?.message || "دروستکردنی براند سەرکەوتوو نەبوو");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-right text-[#273959] font-bold text-[20px]">
        زیادکردنی براند
      </h2>

      <TextInput
        label=":ناوی سەرەکی (ئینگلیزی)"
        value={form.name}
        onChange={(v) => setForm((p) => ({ ...p, name: v }))}
        dir="ltr"
      />

      <SelectInput
        label=":پۆلی دایک"
        value={form.categoryId}
        options={categoryOptions}
        onChange={(v) => setForm((p) => ({ ...p, categoryId: v }))}
        disabled={loadingCats}
      />

      <button
        type="button"
        onClick={submit}
        className="px-8 py-2.5 bg-slate-800 text-white rounded-lg"
      >
        پاشەکەوتکردن
      </button>
    </div>
  );
}
