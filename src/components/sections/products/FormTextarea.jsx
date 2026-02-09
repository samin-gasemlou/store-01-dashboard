export default function FormTextarea({ label }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        rows={4}
        className="
          rounded-xl
          border
          p-4
          text-sm
          placeholder:text-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-blue-200
        "
      />
    </div>
  );
}
