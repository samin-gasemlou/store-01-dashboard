import { useNavigate } from "react-router-dom";

export default function StatCard({ title, value, action }) {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    navigate("/orders");
  };

  return (
    <div className="bg-white mt-4 rounded-[20px] w-full min-h-45.5 shadow-sm p-6 flex justify-between items-start text-right text-[#273959] border border-[#27375626]">
      {action && (
        <button
          onClick={handleViewOrders}
          className="text-[13px] sm:text-[14px] md:text-[15px] px-4 py-2 rounded-[10px] border border-[#27375626] bg-[#2A3E6326]"
        >
          مشاهده
        </button>
      )}

      <div className="w-full">
        <p className="text-[16px] sm:text-[18px] md:text-[20px] font-bold">
          {title}
        </p>
        <p className="text-[20px] sm:text-[22px] md:text-2xl font-bold mt-2">
          {value}
        </p>
      </div>
    </div>
  );
}
