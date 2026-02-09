import { topProducts } from "./topProductsData";

export default function TopProducts({ data = topProducts }) {
  const exportToExcel = () => {
    const headers = ["عنوان", "تعداد فروش"];
    const rows = data.map(item => [item.title, item.count]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map(e => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "top-products.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2
          text-[12px] sm:text-[13px] md:text-sm
          px-4 py-2 rounded-[10px] bg-[#2A3E6326] text-[#2A3E63] border border-[#27375626]"
        >
          <img src="/import.svg" alt="" />
          Excel
        </button>

        <h3 className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold text-[#273959]">
          کالاهای پرفروش
        </h3>
      </div>

      <ul className="space-y-4">
        {data.map(item => (
          <li
            key={item.id}
            className="flex items-center justify-between border-b border-b-[#0000000D] pb-3 last:border-none"
          >
            <span className="font-bold text-[13px] w-[50%]">{item.count} فروش</span>
            <span className="font-bold text-[13px] text-right">{item.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
