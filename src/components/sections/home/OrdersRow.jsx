export default function OrdersRow({ order }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "تکمیل شده":
        return "text-[#0D9747] bg-[#E7F8F0]";
      case "در انتظار":
        return "text-[#F2994A] bg-[#FFF8ED]";
      case "لغو شده":
        return "text-[#EB5757] bg-[#FFF0F0]";
      default:
        return "text-[#273959] bg-[#F2F3F5]";
    }
  };

  return (
    <tr className="border-b border-b-[#0000000D] last:border-none hover:bg-gray-50 transition-colors">
      
      {/* ID */}
      <td className="py-2 sm:py-3 md:py-4 font-medium text-[#273959] text-[10px] sm:text-[13px] md:text-sm px-2">
        #{order.id}
      </td>

      {/* مشتری */}
      <td className="py-2 sm:py-3 md:py-4 text-[#273959] font-medium text-[11px] sm:text-[13px] md:text-sm px-2">
        {order.customer || order.name}
      </td>

      {/* قیمت */}
      <td className="py-2 sm:py-3 md:py-4 font-bold text-[#273959] text-[10px] sm:text-[13px] md:text-[12px] px-2">
        {order.price}
      </td>

      {/* وضعیت */}
      <td className="py-2 sm:py-3 md:py-4 text-right  px-2">
        <span
          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold
          text-[10px] sm:text-[12px] md:text-xs
          ${getStatusColor(order.status)}`}
        >
          {order.status}
        </span>
      </td>

    </tr>
  );
}
