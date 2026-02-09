import { useState, useEffect } from "react";

export default function TextArea({ label, value = "", onChange }) {
  const [text, setText] = useState(value);

  const handleChange = (e) => {
    setText(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  // اگر prop value تغییر کند، state هم آپدیت شود
  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <div className="flex flex-col gap-1 sm:gap-2 w-full">
      <label className="text-xs sm:text-sm md:text-[13px] font-medium text-right py-2">
{label}</label>
      <textarea
        rows={4}
        value={text}
        onChange={handleChange}
        className="rounded-xl border p-2 sm:p-4 text-xs sm:text-sm md:text-[13px] bg-[#ffffff] border-[#0000004D]"
      />
    </div>
  );
}
