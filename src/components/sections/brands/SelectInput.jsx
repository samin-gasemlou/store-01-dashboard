export default function SelectInput({
  label,
  value,
  onChange,
  options = [],
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs sm:text-sm font-medium text-right">
        {label}
      </label>

      <div className="relative">
        <select
          value={value ?? ""}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-white text-[12px] sm:text-[13px] h-14.5 px-4 rounded-[10px] border border-[#0000004D] text-right appearance-none"
        >
          <option value="">هەڵبژێرە</option>

          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>

        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <img src="/arrow.svg" alt="" />
        </span>
      </div>
    </div>
  );
}
