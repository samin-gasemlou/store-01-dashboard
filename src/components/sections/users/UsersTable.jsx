import UsersTableHeader from "./UsersTableHeader";
import UsersRow from "./UsersRow";
import { usersData } from "./usersData.js";
import * as XLSX from "xlsx";

export default function UsersTable() {
  const handleDownloadExcel = () => {
    if (!usersData || !usersData.length) return;

    // آماده سازی داده‌ها برای اکسل
    const excelData = usersData.map(user => ({
      "نام کاربری": user.username,
      "تاریخ ثبت نام": user.registerDate,
      "سود خالص (IQD)": user.netProfit,
      "مجموع خرید (IQD)": user.totalPurchase,
      "تعداد خرید": user.purchaseCount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    XLSX.writeFile(workbook, "users-report.xlsx");
  };
  return (
    <section
      className="
        bg-white
        rounded-2xl
        shadow-sm
        p-4
        sm:p-6
        w-full
      "
    >
   <div className="flex items-center justify-between mb-6 gap-4">
      <button
        onClick={handleDownloadExcel}
        className="
          flex items-center gap-2
          text-[13px]
          sm:text-sm
          px-4
          py-2
          rounded-xl
          bg-[#2A3E6326]
          text-[#2A3E63]
          border
          border-[#27375626]
          hover:bg-gray-300
          transition
        "
      >
        <img src="/import.svg" alt="" />
        Excel
      </button>

      <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#1F3A5F]">
        لیست کاربران
      </h3>
    </div>

     {/* TABLE */}
<div className="overflow-x-hidden lg:overflow-x-auto">
  <div className="w-full lg:min-w-180">
    <UsersTableHeader />

    <div className="divide-y divide-[#0000000D]">
      {usersData.map(user => (
        <UsersRow key={user.id} user={user} />
      ))}
    </div>
  </div>
</div>

    </section>
  );
}
