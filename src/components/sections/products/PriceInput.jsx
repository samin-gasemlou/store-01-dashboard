import { useState, useEffect } from "react";

export default function PriceInput({ label, value = "", onChange }) {
  const [inputValue, setInputValue] = useState(formatNumber(value));

  function formatNumber(val) {
    if (!val) return "";
    // حذف همه غیر عددی‌ها
    const num = val.toString().replace(/\D/g, "");
    // فرمت هزارگان
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(rawValue)) {
      const formatted = formatNumber(rawValue);
      setInputValue(formatted);
      if (onChange) onChange(rawValue);
    }
  };

  // اگر prop value تغییر کند هم آپدیت شود
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(formatNumber(value));
  }, [value]);

  return (
    <div className="flex flex-col gap-1 sm:gap-2 w-full sm:w-auto">
     <label className="text-xs sm:text-sm md:text-[13px] font-medium text-right py-2">
{label}</label>
      <input
        value={inputValue}
        onChange={handleChange}
        className="h-11 sm:h-13.75 w-full sm:w-41.25 text-xs sm:text-sm md:text-[13px] px-3 sm:px-4 rounded-xl border border-[#0000004D] bg-[#ffffff] text-right"
      />
    </div>
  );
}
