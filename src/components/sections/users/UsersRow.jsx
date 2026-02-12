export default function UsersRow({ user, onOpen }) {
  return (
    <>
      {/* ✅ DESKTOP/TABLET (sm+) */}
      <button
        type="button"
        onClick={onOpen}
        className="
          hidden sm:grid
          w-full
          grid-cols-5
          items-center
          text-[13px]
          sm:text-[14px]
          border-b
          border-b-[#0000000D]
          py-4
          last:border-none
          hover:bg-slate-50
          transition
        "
      >
        <span className="text-left whitespace-nowrap">{user.purchaseCount} عدد</span>
        <span className="text-center whitespace-nowrap">{user.totalPurchase.toLocaleString()} IQD</span>
        <span className="text-center whitespace-nowrap">{user.netProfit.toLocaleString()} IQD</span>
        <span className="text-center whitespace-nowrap">{user.registerDate}</span>
        <span className="text-right font-medium">{user.username}</span>
      </button>

      {/* ✅ MOBILE (<sm): فقط نام کاربر */}
      <button
        type="button"
        onClick={onOpen}
        className="
          sm:hidden
          w-full
          flex
          items-center
          justify-end
          text-right
          text-[14px]
          font-medium
          border-b
          border-b-[#0000000D]
          py-4
          px-2
          hover:bg-slate-50
          transition
        "
      >
        {user.username}
      </button>
    </>
  );
}
