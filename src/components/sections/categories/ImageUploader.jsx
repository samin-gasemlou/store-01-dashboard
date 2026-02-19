// dashboard/src/components/sections/categories/ImageUploader.jsx
import { useMemo } from "react";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function ImageUploader({ label, value, onChange }) {
  const previewSrc = useMemo(() => {
    if (typeof value === "string" && value.trim()) return value;
    return "/category.png";
  }, [value]);

  const onPick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const b64 = await fileToBase64(f);
      onChange?.(b64);
    } catch (err) {
      console.error(err);
      alert("هەڵە لە هەڵبژاردنی وێنە");
    }
  };

  return (
    <div className="flex flex-col items-center sm:items-end justify-center gap-4 sm:gap-6">
      <label className="text-sm font-medium text-right">{label}</label>

      <div className="w-25.75 h-25.75 border border-[#00000033] rounded-2xl flex items-center justify-center relative overflow-hidden">
        <img src={previewSrc} alt="" className="h-24 object-contain" />

        <input
          type="file"
          accept="image/*"
          onChange={onPick}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
