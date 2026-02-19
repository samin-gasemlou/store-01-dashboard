import { useEffect, useState } from "react";
import UsersTableHeader from "./UsersTableHeader";
import UsersRow from "./UsersRow";
import * as XLSX from "xlsx";
import UserProfileModal from "../../modals/UserProfileModal";
import { fetchUsers } from "../../../services/users.service.js";

function safeFaDate(d) {
  try {
    return new Date(d).toLocaleDateString("fa-IR");
  } catch {
    return "-";
  }
}

// ✅ unwrap helper: پوشش data.data و انواع ساختارها
function unwrapApi(res) {
  if (!res) return null;
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
}

// ✅ خروجی‌های رایج بک: {data:[...] } یان {items:[...]} یان خود آرایه
function unwrapList(res) {
  const p = unwrapApi(res);
  if (Array.isArray(p)) return p;
  if (Array.isArray(p?.data)) return p.data;
  if (Array.isArray(p?.items)) return p.items;
  // بعضی بک‌ها: { total,page,limit,data }
  if (Array.isArray(p?.rows)) return p.rows;
  return [];
}

function normalizeUserForUI(u) {
  const id = String(u?._id || u?.id || u?.userId || "");

  // ✅ پوشش ناو‌ها لە مدل‌های مختلف
  const fullName =
    String(u?.fullName || "").trim() ||
    String(u?.name || "").trim() ||
    "";

  const firstName = String(u?.firstName || "").trim();
  const lastName = String(u?.lastName || "").trim();

  const phone =
    String(u?.phone1 || "").trim() ||
    String(u?.phone || "").trim() ||
    String(u?.mobile || "").trim() ||
    "";

  const username =
    String(u?.username || "").trim() ||
    fullName ||
    `${firstName} ${lastName}`.trim() ||
    phone ||
    "—";

  const stats = u?.stats || {};
  const purchaseCount = Number(stats.purchaseCount ?? u?.purchaseCount ?? 0);
  const totalPurchase = Number(stats.totalPurchase ?? u?.totalPurchase ?? 0);
  const netProfit = Number(stats.netProfit ?? u?.netProfit ?? 0);

  return {
    id,
    username,
    registerDate: u?.createdAt ? safeFaDate(u.createdAt) : "—",
    purchaseCount,
    totalPurchase,
    netProfit,

    // بۆ مودال:
    _raw: u,
  };
}

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const out = await fetchUsers({ page: 1, limit: 50, sort: "-createdAt" });

      // ✅ FIX: هر نوع response را بە لیست تبدیل کن
      const list = unwrapList(out);

      const normalized = (list || [])
        .filter((x) => x && (x._id || x.id))
        .map(normalizeUserForUI);

      setUsers(normalized);
    } catch (e) {
      console.error("fetchUsers failed:", e);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDownloadExcel = () => {
    if (!users || !users.length) return;

    const excelData = users.map((user) => ({
      "ناو کاربری": user.username,
      "ڕێکەوت ثبت ناو": user.registerDate,
      "سود خالص (IQD)": user.netProfit,
      "مجموع خرید (IQD)": user.totalPurchase,
      "تعداد خرید": user.purchaseCount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    XLSX.writeFile(workbook, "users-report.xlsx");
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setProfileOpen(true);
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 w-full">
      <div className="flex items-center justify-between mb-6 gap-4">
        <button
          onClick={handleDownloadExcel}
          className="flex items-center gap-2 text-[13px] sm:text-sm px-4 py-2 rounded-xl bg-[#2A3E6326] text-[#2A3E63] border border-[#27375626] hover:bg-gray-300 transition"
        >
          <img src="/import.svg" alt="" />
          Excel
        </button>

        <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#1F3A5F]">
          لیست کاربران
        </h3>
      </div>

      <div className="overflow-x-hidden lg:overflow-x-auto">
        <div className="w-full lg:min-w-180">
          <UsersTableHeader />

          <div className="divide-y divide-[#0000000D]">
            {loading ? (
              <div className="py-6 text-center text-sm text-gray-500">
                لە حال دریافت...
              </div>
            ) : users.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">
                کاربری یافت نشد
              </div>
            ) : (
              users.map((user) => (
                <UsersRow
                  key={user.id}
                  user={user}
                  onOpen={() => openUserModal(user)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <UserProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={selectedUser}
        onAfterChange={async () => {
          setProfileOpen(false);
          await refresh();
        }}
      />
    </section>
  );
}
