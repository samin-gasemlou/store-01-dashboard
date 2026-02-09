export default function TextInput({ label, value }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs sm:text-sm font-medium text-right">{label}</label>
      <input
        value={value}
        readOnly
        className="w-full bg-white text-[12px] sm:text-[13px] h-14.5 px-4 rounded-[10px] border border-[#0000004D] text-right"
      />
    </div>
  );
}
