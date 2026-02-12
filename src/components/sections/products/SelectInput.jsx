import { useState } from "react";

export default function SelectInput({ label, value, options = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value || "");

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    if (onChange) onChange(option);
  };

  return (
    <div className="flex flex-col gap-1 sm:gap-2 text-right w-full min-w-0 relative">
      <label className="text-xs sm:text-sm md:text-[13px] font-medium text-right py-2">{label}</label>

      <div
        onClick={() => setOpen((p) => !p)}
        className="h-11 sm:h-13.75 px-3 sm:px-4 rounded-xl border border-[#0000004D] flex items-center justify-between text-xs sm:text-sm text-right w-full min-w-0 bg-[#ffffff] cursor-pointer"
      >
        <span>{selected}</span>
        <img src="/arrow.svg" alt="" />
      </div>

      {open && (
        <div className="absolute top-full mt-1 w-full bg-white border border-[#0000004D] rounded-xl shadow-lg z-10 max-h-48 overflow-auto">
          {options.map((option, i) => (
            <div
              key={i}
              onClick={() => handleSelect(option)}
              className="px-3 py-2 text-right text-xs sm:text-sm md:text-[13px] hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
