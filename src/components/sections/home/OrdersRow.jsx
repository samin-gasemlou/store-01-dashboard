// dashboard/src/components/sections/home/OrdersRow.jsx
export default function OrdersRow({ order }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "complete":
        return "text-[#0D9747] border-r-4 border-r-[#0D9747]";
      case "pending":
        return "text-[#DDB802] border-r-4 border-r-[#DDB802]";
      case "rejected":
        return "text-[#E93232] border-r-4 border-r-[#E93232]";
      default:
        return "text-[#273959] border-r-4 border-r-[#273959]";
    }
  };

  return (
    <tr className="border-b border-b-[#0000000D] last:border-none hover:bg-gray-50 transition-colors">
      <td className="py-2 sm:py-3 md:py-4 font-medium text-[#273959] text-[10px] sm:text-[13px] md:text-sm px-2">
        #{order.id}
      </td>

      <td className="py-2 sm:py-3 md:py-4 text-[#273959] font-medium text-[11px] sm:text-[13px] md:text-sm px-2">
        {order.customer || order.name}
      </td>

      <td className="py-2 sm:py-3 md:py-4 font-bold text-[#273959] text-[10px] sm:text-[13px] md:text-[12px] px-2">
        {order.price}
      </td>

      <td className="py-2 sm:py-3 md:py-4 text-right px-2">
        <span
          className={`px-2 sm:px-3 py-1 sm:py-1.5 font-bold text-[10px] sm:text-[12px] md:text-xs ${getStatusColor(order.status)}`}
        >
          {order.statusLabel ?? order.status}
        </span>
      </td>
    </tr>
  );
}
