// dashboard/src/components/sections/home/OrdersRow.jsx
export default function OrdersRow({ order }) {
  const getStatusStyle = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "complete":
        return {
          text: "text-[#0D9747]",
          bar: "border-r-[#0D9747]",
        };
      case "pending":
        return {
          text: "text-[#DDB802]",
          bar: "border-r-[#DDB802]",
        };
      case "rejected":
        return {
          text: "text-[#E93232]",
          bar: "border-r-[#E93232]",
        };
      default:
        return {
          text: "text-[#273959]",
          bar: "border-r-[#273959]",
        };
    }
  };

  const st = getStatusStyle(order?.status);

  // ✅ حل کامل mismatch ناو مشتری
  const getCustomerName = () => {
    const raw = order?._raw || order;

    const user = raw?.userId;

    if (!user) return "—";

    // حالت AppUser
    if (user?.fullName) return user.fullName;

    // حالت AdminUser
    const first = String(user?.firstName || "").trim();
    const last = String(user?.lastName || "").trim();
    const full = `${first} ${last}`.trim();
    if (full) return full;

    // بعضی وقت‌ها ممکنه name ذخیره کراوە باشه
    if (user?.name) return user.name;

    // fallback موبایل
    if (user?.mobile) return user.mobile;
    if (user?.phone1) return user.phone1;

    return "—";
  };

  return (
    <tr className="border-t border-t-[#0000000D] last:border-b-0 hover:bg-gray-50 transition-colors">
      <td className="py-3 sm:py-4 font-medium text-[#273959] text-[11px] sm:text-[13px] md:text-sm px-2">
        {order?.id ? `#${order.id}` : "—"}
      </td>

      <td className="py-3 sm:py-4 text-[#273959] font-medium text-[11px] sm:text-[13px] md:text-sm px-2">
        {getCustomerName()}
      </td>

      <td className="py-3 sm:py-4 font-bold text-[#273959] text-[11px] sm:text-[13px] md:text-sm px-2 whitespace-nowrap">
        {order?.price || "0 IQD"}
      </td>

      <td className="py-3 sm:py-4 text-right px-2">
        <span
          className={`
            inline-flex items-center justify-end
            px-2 sm:px-3 py-1 sm:py-1.5
            font-bold text-[10px] sm:text-[12px] md:text-xs
            ${st.text}
            border-r-4 ${st.bar}
            rounded-sm
            whitespace-nowrap
          `}
          title={order?.statusLabel ?? order?.status}
        >
          {order?.statusLabel ?? order?.status ?? "—"}
        </span>
      </td>
    </tr>
  );
}
