export default function ImageUploader({ label }) {
  return (
    <div className="flex flex-col items-center sm:items-end justify-center gap-4 sm:gap-6">
      <label className="text-sm font-medium text-right">{label}</label>

      <div className="w-25.75 h-25.75 border border-[#00000033] rounded-2xl flex items-center justify-center">
        <img src="/category.png" alt="" className="h-24 object-contain" />
      </div>
    </div>
  );
}
