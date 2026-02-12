export default function TextInput({ label, value }) {
  return (
    <div className="flex flex-col gap-1 sm:gap-2 text-right w-full min-w-0">
      <label className="text-xs sm:text-sm md:text-[13px] font-medium py-2">{label}</label>
      <input
        defaultValue={value}
        className="h-11 sm:h-13.75 w-full min-w-0 px-3 sm:px-4 rounded-xl border border-[#0000004D] text-xs sm:text-sm md:text-[13px] bg-[#ffffff] text-right"
      />
    </div>
  );
}
