import { useState } from "react";
import OrderRow from "./OrderRow";

// ماک‌دیتای سفارشات
const mockOrders = [
  {
    id: 5688,
    invoice: "1,450,000 IQD",
    status: "در انتظار بررسی",
    date: "۱۴۰۴/۵/۳۰",
    customer: "مریم فداکار"
  },
  {
    id: 5689,
    invoice: "2,300,000 IQD",
    status: "تکمیل شده",
    date: "۱۴۰۴/۵/۲۹",
    customer: "علی رضایی"
  },
  {
    id: 5690,
    invoice: "980,000 IQD",
    status: "لغو شده",
    date: "۱۴۰۴/۵/۲۸",
    customer: "سارا احمدی"
  },
  {
    id: 5691,
    invoice: "3,200,000 IQD",
    status: "در انتظار بررسی",
    date: "۱۴۰۴/۵/۲۷",
    customer: "سارا احمدی"
  },
  {
    id: 9691,
    invoice: "3,200,000 IQD",
    status: "در انتظار بررسی",
    date: "۱۴۰۴/۵/۲۷",
   customer: "سارا احمدی"
  },
  {
    id: 5651,
    invoice: "3,200,000 IQD",
    status: "در انتظار بررسی",
    date: "۱۴۰۴/۵/۲۷",
    customer: "سارا احمدی"
  },
  {
    id: 5690,
    invoice: "3,200,000 IQD",
    status: "در انتظار بررسی",
    date: "۱۴۰۴/۵/۲۷",
   customer: "سارا احمدی"
  },
];

export default function OrdersTable() {
  const [orders, setOrders] = useState(mockOrders);

  const handleDelete = (id) => {
    if (confirm("آیا مطمئن هستید می‌خواهید این سفارش حذف شود؟")) {
      setOrders(prev => prev.filter(order => order.id !== id));
    }
  };

  const handleSettings = (id) => {
    console.log("Settings clicked for order:", id);
    alert(`ویرایش سفارش #${id}`);
  };

  return (
    <div>
      {/* Title */}
      <h2 className="text-right text-[#273959] font-bold text-[20px] mb-6">
        لیست سفارش‌ها
      </h2>

      {/* Header */}
      <div className=" flex-row hidden md:flex items-center justify-between text-[15px] font-extrabold text-[#000000] pb-3 border-b-2 border-b-[#0000004D] px-4">
        <span>عملیات</span>
        <span>کد سبد خرید</span>
        <span>مجموع فاکتور</span>
        <span>وضعیت سفارش</span>
        <span>تاریخ</span>
        <span>نام کاربری</span>
      </div>

      {/* Rows */}
      <div className="divide-y px-4">
        {orders.map(order => (
          <OrderRow
            key={order.id}
            order={order}
            onDelete={() => handleDelete(order.id)}
            onSettings={() => handleSettings(order.id)}
          />
        ))}
      </div>
    </div>
  );
}
