export default function FormInput({ label, placeholder }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 text-right">
        {label}
      </label>
      <input
        placeholder={placeholder}
        className="
          h-11
          px-4
          rounded-xl
          border
          text-sm
          placeholder:text-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-blue-200 text-right
        "
      />
    </div>
  );
}
