export default function AuthCard({ title, children }) {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        {title}
      </h2>
      {children}
    </div>
  );
}
