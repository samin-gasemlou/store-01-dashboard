// dashboard/src/components/sections/products/PriceInput.jsx
export default function PriceInput({ label, value = "", onChange }) {
  function formatNumber(val) {
    if (val === null || val === undefined || val === "") return "";
    const num = String(val).replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const raw = String(value ?? "").replace(/\D/g, "");
  const formatted = formatNumber(raw);

  const handleChange = (e) => {
    const nextRaw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
    if (onChange) onChange(nextRaw);
  };

  return (
    <div className="flex flex-col gap-1 sm:gap-2 w-full min-w-0">
      <label className="text-xs sm:text-sm md:text-[13px] font-medium text-right py-2">
        {label}
      </label>

      <input
        value={formatted}
        onChange={handleChange}
        inputMode="numeric"
        className="h-11 sm:h-13.75 w-full min-w-0 text-xs sm:text-sm md:text-[13px] px-3 sm:px-4 rounded-xl border border-[#0000004D] bg-[#ffffff] text-right"
      />
    </div>
  );
}
