export default function AuthInput({
  placeholder,
  type = "text",
  value,
  onChange
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-600"
    />
  );
}
