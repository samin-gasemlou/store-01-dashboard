import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const items = [
  { label: "پیشخوان", icon: "/home.svg", path: "/" },
  { label: "محصولات", icon: "/shop.svg", path: "/products" },
  { label: "سفارشات", icon: "/shopping-cart.svg", path: "/orders" },
  { label: "گزارشات", icon: "/chart.svg", path: "/reports" },
  { label: "کاربران", icon: "/user-white.svg", path: "/users" },
  { label: "عمده فروشی", icon: "/people.svg", path: "/wholesale" },
  { label: "تنظیمات سایت", icon: "/setting-5.svg", path: "/settings" },
  { label: "کد تخفیف", icon: "/medal-star.svg", path: "/discounts" },
];

const productsSubmenu = [
  { label: "همه محصولات", path: "/products" },
  { label: "افزودن محصول", path: "/products/add" },
  { label: "دسته‌بندی‌ها", path: "/products/categories" },
  { label: "برندها", path: "/products/brands" },
];

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ================= Desktop Sidebar ================= */}
      <aside className="hidden lg:block h-full sticky top-6 rounded-t-[20px] bg-linear-to-b from-[#24344F] to-[#2B4168] text-white px-4 py-8">
        <h1 className="text-3xl font-extrabold text-center mb-10">
          01<span className="ml-1">STORE</span>
        </h1>

        <SidebarContent location={location} onNavigate={() => {}} />
      </aside>

      {/* ================= Mobile & Tablet Menu ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
        />
      )}

      <aside
        className={`
          lg:hidden
          fixed
          top-20
          right-4
          left-4
          z-50
          rounded-2xl
          bg-linear-to-b from-[#24344F] to-[#2B4168]
          text-white
          px-4
          py-6
          transition
          ${open ? "block" : "hidden"}
        `}
      >
        <SidebarContent
          location={location}
          onNavigate={() => setOpen(false)}
        />
      </aside>

      {/* Floating Top Bar */}
      <div className="lg:hidden fixed top-2 right-4 left-4 z-50">
        <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-linear-to-b from-[#24344F] to-[#2B4168] text-white shadow-lg">
          <button
            onClick={() => setOpen(!open)}
            className="text-2xl font-bold"
          >
            ☰
          </button>

          <h1 className="text-lg font-extrabold">
            01<span className="ml-1">STORE</span>
          </h1>
        </div>
      </div>
    </>
  );
}

/* ================= Shared Sidebar Content ================= */
function SidebarContent({ location, onNavigate }) {
  return (
    <nav className="space-y-3">
      {items.map((i) => {
        const isActive =
          location.pathname === i.path ||
          location.pathname.startsWith(i.path + "/");

        const isProducts = i.path === "/products";

        return (
          <div key={i.path}>
            <Link
              to={i.path}
              onClick={onNavigate}
              className={`
                w-full flex items-center justify-end gap-2 px-4 py-3 rounded-xl text-sm transition
                ${isActive ? "bg-[#FFFFFF4D]" : "bg-[#FFFFFF0D] hover:bg-[#FFFFFF4D]"}
              `}
            >
              <span>{i.label}</span>
              <img src={i.icon} alt="" />
            </Link>

            {isProducts && isActive && (
              <div className="mt-2 mr-6 space-y-2 flex flex-col items-end">
                {productsSubmenu.map((sub) => {
                  const subActive = location.pathname === sub.path;

                  return (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      onClick={onNavigate}
                      className={`px-4 py-2 rounded-lg text-sm flex items-center gap-3
                        ${subActive ? "text-[#7FAEFF]" : "hover:text-[#7FAEFF]"}
                      `}
                    >
                      {sub.label}
                      <div
                        className={`w-3.25 h-[1.5px] ${
                          subActive ? "bg-[#7FAEFF]" : "bg-white"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
