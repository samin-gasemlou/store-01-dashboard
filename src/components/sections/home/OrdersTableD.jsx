import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrdersRow from "./OrdersRow";
import { orders as mockOrders } from "./ordersData";

export default function OrdersTableD() {
  const [orders] = useState(mockOrders);
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/orders");
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleViewAll}
          className="text-[12px] sm:text-[13px] md:text-sm
          px-4 py-2 rounded-[10px] bg-[#2A3E6326] text-[#2A3E63] border border-[#27375626]"
        >
          مشاهده
        </button>

        <h3 className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-[#273959]">
          آخرین سفارش‌ها
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody className="text-center">
            {orders.map(order => (
              <OrdersRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
