// dashboard/src/components/layout/TopBar.jsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminUser, logout } from "../../lib/auth.js";

export default function TopBar() {
  const nav = useNavigate();

  const name = useMemo(() => {
    const u = getAdminUser();
    return u?.name || u?.email || "—";
  }, []);

  const onLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  return (
    <div
      className="
        w-full
        mt-26
        md:mt-40
        lg:mt-12
        bg-white
        rounded-[20px]
        shadow-sm
        px-4
        py-4
        flex
        items-center
        justify-between
        gap-4
      "
    >
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onLogout}
          className="w-10 h-10 flex items-center justify-center text-gray-600"
        >
          <img src="/log-out.svg" alt="" />
        </button>

        <div
          className="
            hidden
            md:flex
            items-center
            gap-2
            px-2
            py-3
            rounded-[9px]
            border
            border-[#2739591A]
            bg-[#F2F3F5]
            text-[11px]
            sm:text-[12px]
            md:text-[13px]
          "
        >
          {name}
          <img src="/user.svg" alt="" />
        </div>
      </div>

      <div className="relative w-full sm:w-105">
        <input
          className="
            w-full
            rounded-[9px]
            border
            border-[#2739591A]
            bg-[#F2F3F5]
            px-4
            py-4
            pr-10
            text-right
            text-[11px]
            sm:text-[12px]
            md:text-[13px]
          "
          placeholder="جستجو کنید: نام کاربری / کد سفارش / محصول"
        />
        <img
          src="/search.svg"
          className="absolute right-3 top-1/2 -translate-y-1/2"
          alt=""
        />
      </div>
    </div>
  );
}
