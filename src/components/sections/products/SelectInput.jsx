// dashboard/src/components/sections/products/SelectInput.jsx
import { useEffect, useMemo, useState } from "react";

export default function SelectInput({ label, value = "", options = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value || "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(value || "");
  }, [value]);

  const normalizedOptions = useMemo(() => {
    // options can be: ["A","B"] OR [{value,label}]
    return (options || []).map((o) => {
      if (o && typeof o === "object") {
        return { value: String(o.value ?? ""), label: String(o.label ?? o.value ?? "") };
      }
      return { value: String(o ?? ""), label: String(o ?? "") };
    });
  }, [options]);

  const handleSelect = (val) => {
    setSelected(val);
    setOpen(false);
    if (onChange) onChange(val);
  };

  return (
    <div className="flex flex-col gap-1 sm:gap-2 text-right w-full min-w-0 relative">
      <label className="text-xs sm:text-sm md:text-[13px] font-medium text-right py-2">
        {label}
      </label>

      <div
        onClick={() => setOpen((p) => !p)}
        className="h-11 sm:h-13.75 px-3 sm:px-4 rounded-xl border border-[#0000004D] flex items-center justify-between text-xs sm:text-sm text-right w-full min-w-0 bg-[#ffffff] cursor-pointer"
      >
        <span>{selected}</span>
        <img src="/arrow.svg" alt="" />
      </div>

      {open && (
        <div className="absolute top-full mt-1 w-full bg-white border border-[#0000004D] rounded-xl shadow-lg z-10 max-h-48 overflow-auto">
          {normalizedOptions.map((opt, i) => (
            <div
              key={`${opt.value}-${i}`}
              onClick={() => handleSelect(opt.value)}
              className="px-3 py-2 text-right text-xs sm:text-sm md:text-[13px] hover:bg-gray-100 cursor-pointer"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
