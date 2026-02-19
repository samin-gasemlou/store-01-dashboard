import { useState } from "react";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";
import ImageUploader from "./ImageUploader";
import { createCategory } from "../../../services/categories.service.js";

export default function AddCategoryForm({ onCreated, parentOptions = [] }) {
  const [form, setForm] = useState({
    name_en: "",
    name_ar: "",
    name_kur: "",
    parentId: "",
    image: "",
  });

  const handle = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.name_en || form.name_en.trim().length < 2) {
      alert("ناوی سەرەکی (ئینگلیزی) پێویستە.");
      return;
    }

    try {
      await createCategory({
        name_en: form.name_en,
        name_ar: form.name_ar || "",
        name_kur: form.name_kur || "",
        image: form.image || "",
        parentId: form.parentId || null, // ✅ ارسال بە بک
      });

      setForm({ name_en: "", name_ar: "", name_kur: "", parentId: "", image: "" });
      onCreated?.();
      alert("پۆل بە سەرکەوتوویی دروستکرا.");
    } catch (e) {
      alert(e?.message || "دروستکردنی پۆل سەرکەوتوو نەبوو");
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <h2 className="text-right text-[#273959] font-bold text-[18px] sm:text-[20px]">
        زیادکردنی پۆل
      </h2>

      <TextInput
        label=":ناوی سەرەکی (ئینگلیزی)"
        value={form.name_en}
        onChange={(v) => handle("name_en", v)}
        dir="ltr"
      />
      <TextInput
        label=":ناوی عەرەبی"
        value={form.name_ar}
        onChange={(v) => handle("name_ar", v)}
      />
      <TextInput
        label=":ناوی کوردی"
        value={form.name_kur}
        onChange={(v) => handle("name_kur", v)}
      />

      <SelectInput
        label=":پۆلی دایک"
        value={form.parentId}
        options={parentOptions}
        onChange={(v) => handle("parentId", v)}
      />

      <ImageUploader
        label=":وێنەی پۆل"
        value={form.image}
        onChange={(v) => handle("image", v)}
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
