export default function PriceInput({ label, value = "", onChange }) {
  function formatNumber(val) {
    if (val === null || val === undefined || val === "") return "";
    const num = val.toString().replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(rawValue)) {
      // فرمت داخل خود input (بدون state)
      e.target.value = formatNumber(rawValue);
      if (onChange) onChange(rawValue);
    }
  };

  const formatted = formatNumber(value);

  return (
    <div className="flex flex-col gap-1 sm:gap-2 w-full min-w-0">
      <label className="text-xs sm:text-sm md:text-[13px] font-medium text-right py-2">
        {label}
      </label>

      <input
        key={formatted}                // ✅ وقتی value بیرونی تغییر کنه، input ری‌مونت میشه و مقدار جدید میاد
        defaultValue={formatted}       // ✅ uncontrolled
        onChange={handleChange}
        inputMode="numeric"
        className="h-11 sm:h-13.75 w-full min-w-0 text-xs sm:text-sm md:text-[13px] px-3 sm:px-4 rounded-xl border border-[#0000004D] bg-[#ffffff] text-right"
      />
    </div>
  );
}
