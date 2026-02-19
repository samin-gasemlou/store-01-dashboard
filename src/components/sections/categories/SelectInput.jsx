// dashboard/src/components/sections/categories/SelectInput.jsx
export default function SelectInput({ label, value, options = [], onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs sm:text-sm font-medium text-right">{label}</label>

      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-white text-[12px] sm:text-[13px] h-14.5 px-4 rounded-[10px] border border-[#0000004D] text-right appearance-none"
        >
          <option value="" disabled>
            هەڵبژێرە
          </option>
          {options.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o}>
              {o.label ?? o}
            </option>
          ))}
        </select>
        <span className="absolute left-4 top-1/2 -translate-y-1/2">
          <img src="/arrow.svg" alt="" />
        </span>
      </div>
    </div>
  );
}
