import { useState } from "react";
import OrderRow from "./OrderRow";
import OrderDetailsModal from "../../modals/OrderDetailsModal";
import { fetchOrderById } from "../../../services/orders.service";
import { useOrders } from "../../../hooks/useOrders";

export default function OrdersTable() {
  const { orders, setOrders } = useOrders();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleDelete = (id) => {
    if (confirm("آیا مطمئن هستید می‌خواهید این سفارش حذف شود؟")) {
      setOrders((prev) => prev.filter((order) => order.id !== id));
    }
  };

  const openDetails = async (order) => {
    try {
      const full = await fetchOrderById(order.id);

      const normalizedForModal = {
        id: full._id || order.id,
        invoice: full.total
          ? `${Number(full.total).toLocaleString()} IQD`
          : (order.invoice || "-"),
        status: full.status || order.status,
        date: full.createdAt
          ? new Date(full.createdAt).toLocaleDateString("fa-IR")
          : (order.date || "-"),
        customer: full.userId
          ? `${full.userId.firstName || ""} ${full.userId.lastName || ""}`.trim() ||
            full.userId.phone1 ||
            "-"
          : (order.customer || "-"),
        items: full.items || [],
        user: full.userId || null,
        address: full.address,
        city: full.city,
        shippingCost: full.shippingCost,
        discount: full.discount,
        promoCode: full.promoCode,
      };

      setSelectedOrder(normalizedForModal);
      setDetailsOpen(true);
    } catch (e) {
      console.error(e);
      alert("خطا در دریافت جزئیات سفارش");
    }
  };

  return (
    <div>
      <h2 className="text-right text-[#273959] font-bold text-[20px] mb-6">
        لیست سفارش‌ها
      </h2>

      {/* ✅ DESKTOP HEADER فقط برای md+ */}
      <div className="hidden md:grid grid-cols-6 items-center text-[15px] font-extrabold text-[#000000] pb-3 border-b-2 border-b-[#0000004D] px-4 text-center">
        <span>عملیات</span>
        <span>کد سبد خرید</span>
        <span>مجموع فاکتور</span>
        <span>وضعیت سفارش</span>
        <span>تاریخ</span>
        <span>نام کاربری</span>
      </div>

      <div className="divide-y px-0 md:px-4">
        {orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            onDelete={() => handleDelete(order.id)}
            onOpenDetails={() => openDetails(order)}
          />
        ))}
      </div>

      <OrderDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}
