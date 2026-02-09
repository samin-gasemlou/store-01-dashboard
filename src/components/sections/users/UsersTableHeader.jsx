export default function UsersTableHeader() {
  return (
    <div
      className="
        hidden lg:grid
        grid-cols-5
        text-[14px]
        font-extrabold
        text-[#000000]
        border-b
        border-b-[#0000004D]
        pb-3
        mb-2
      "
    >
      <span className="text-left">تعداد خرید</span>
      <span className="text-center">مجموع خرید</span>
      <span className="text-center">سود خالص</span>
      <span className="text-center">تاریخ ثبت نام</span>
      <span className="text-right">نام کاربری</span>
    </div>
  );
}
