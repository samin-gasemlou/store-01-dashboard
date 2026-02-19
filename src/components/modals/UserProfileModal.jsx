import React, { useEffect, useMemo, useState } from "react";
import BaseModal from "../ui/BaseModal";
import { Instagram, ChevronDown } from "lucide-react";
import {
  fetchUserById,
  fetchUserHistory,
  updateUser,
  deleteUser,
  setUserBlocked,
} from "../../services/users.service.js";

// ✅ unwrap helper: پوشش data.data و انواع ساختارها
function unwrapApi(res) {
  if (!res) return null;
  if (res?.data?.data) return res.data.data;
  if (res?.data) return res.data;
  return res;
}

const UserProfileModal = ({ isOpen, onClose, user, onAfterChange }) => {
  const formKey = useMemo(() => {
    if (!isOpen) return "closed";
    return user?.id ? `user-${user.id}` : "no-user";
  }, [isOpen, user?.id]);

  const [draft, setDraft] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [openCartId, setOpenCartId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fullUser, setFullUser] = useState(null);
  const [history, setHistory] = useState([]);

  const userId = user?.id;

  useEffect(() => {
    if (!isOpen || !userId) return;

    let alive = true;
    setLoading(true);

    (async () => {
      try {
        const uRes = await fetchUserById(userId);
        const u = unwrapApi(uRes);

        const hRes = await fetchUserHistory(userId, 5);
        const h = unwrapApi(hRes);

        if (!alive) return;

        setFullUser(u || null);

        const rows = Array.isArray(h?.history)
          ? h.history
          : Array.isArray(h?.data?.history)
          ? h.data.history
          : Array.isArray(h)
          ? h
          : [];

        setHistory(
          rows.map((x, i) => ({
            id: x?.id || x?._id || `#${i + 1}`,
            profit: `${Number(x?.profit || 0).toLocaleString()} IQD`,
            total: `${Number(x?.total || 0).toLocaleString()} IQD`,
          }))
        );
      } catch (e) {
        console.error("fetch user modal data failed:", e);
        setFullUser(null);
        setHistory([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isOpen, userId]);

  const initialData = useMemo(() => {
    const u = fullUser || user?._raw || {};

    const firstName = String(u?.firstName || "").trim();
    const lastName = String(u?.lastName || "").trim();
    const fullName = String(u?.fullName || "").trim();
    const nameFromOneField = String(u?.name || "").trim();

    const name =
      `${firstName} ${lastName}`.trim() ||
      fullName ||
      nameFromOneField ||
      user?.username ||
      "—";

    return {
      name,
      phone: String(u?.phone1 || u?.phone || u?.mobile || "").trim(),
      address: u?.address || "",
      postalCode: u?.postalCode || "",
      registerDate: u?.createdAt
        ? new Date(u.createdAt).toLocaleDateString("fa-IR")
        : user?.registerDate || "—",
    };
  }, [fullUser, user?._raw, user?.username, user?.registerDate]);

  const current = draft || initialData;

  const startEdit = (field) => {
    if (!draft) setDraft(initialData);
    setEditingField(field);
  };

  const changeValue = (field, value) => {
    setDraft((prev) => ({
      ...(prev || initialData),
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!userId) return;
    try {
      setSaving(true);

      await updateUser(userId, {
        name: current.name,
        phone: current.phone,
        address: current.address,
        postalCode: current.postalCode,
      });

      setFullUser((prev) => {
        const base = prev || {};
        const parts = String(current.name || "").trim().split(/\s+/);
        const firstName = parts[0] || base.firstName || "";
        const lastName = parts.slice(1).join(" ") || base.lastName || "";
        return {
          ...base,
          firstName,
          lastName,
          fullName: String(current.name || "").trim(),
          phone1: current.phone,
          phone: current.phone,
          mobile: current.phone,
          address: current.address,
          postalCode: current.postalCode,
        };
      });

      setEditingField(null);
      setDraft(null);

      alert("زانیارییەکانی بەکارهێنەر نوێکرایەوە ✅");
      onAfterChange?.();
    } catch (e) {
      console.error(e);
      alert(e?.message || "نوێکردنەوە سەرکەوتوو نەبوو");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;
    if (!confirm("دڵنیای؟ دەتەوێت ئەم بەکارهێنەرە بسڕیتەوە؟")) return;

    try {
      setSaving(true);
      await deleteUser(userId);
      alert("بەکارهێنەر سڕایەوە ✅");
      onAfterChange?.();
      onClose?.();
    } catch (e) {
      console.error(e);
      alert(e?.message || "سڕینەوەی بەکارهێنەر سەرکەوتوو نەبوو");
    } finally {
      setSaving(false);
    }
  };

  const isBlocked = Boolean(
    fullUser?.isBlocked ??
      fullUser?.blocked ??
      user?._raw?.isBlocked ??
      user?._raw?.blocked ??
      false
  );

  const blockBtnText = isBlocked ? "ئانبلاک" : "بلاک";

  const handleBlockToggle = async () => {
    if (!userId) return;

    const nextBlocked = !isBlocked;

    try {
      setSaving(true);

      await setUserBlocked(userId, nextBlocked);

      setFullUser((prev) => {
        const base = prev || {};
        return { ...base, isBlocked: nextBlocked, blocked: nextBlocked };
      });

      alert(nextBlocked ? "بەکارهێنەر بلاک کرا ✅" : "بەکارهێنەر ئانبلاک کرا ✅");
      onAfterChange?.();
    } catch (e) {
      console.error(e);
      alert(e?.message || "کرداری بلاک/ئانبلاک سەرکەوتوو نەبوو");
    } finally {
      setSaving(false);
    }
  };

  const toggleCart = (id) => {
    setOpenCartId((p) => (p === id ? null : id));
  };

  const netProfit =
    Number(fullUser?.stats?.netProfit ?? user?.netProfit ?? 0) || 0;
  const totalPurchase =
    Number(fullUser?.stats?.totalPurchase ?? user?.totalPurchase ?? 0) || 0;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`پرۆفایلی بەکارهێنەر : ${current.name} (${user?.username || "ناوی بەکارهێنەر"})`}
      size="xl"
    >
      <div
        key={formKey}
        className="flex overflow-y-auto flex-col lg:flex-row gap-4 lg:gap-6"
      >
        <div className="w-full lg:w-1/3 bg-slate-100/50 p-4 sm:p-5 rounded-xl space-y-4 border border-slate-100 h-fit">
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-bold text-slate-700 mb-1">ناو:</p>
              {editingField === "name" ? (
                <input
                  autoFocus
                  value={current.name}
                  onChange={(e) => changeValue("name", e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-right"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit("name")}
                  className="w-full text-right p-2 rounded-lg hover:bg-white/60"
                >
                  {current.name}
                </button>
              )}
            </div>

            <div>
              <p className="font-bold text-slate-700 mb-1">ژمارەی تەلەفۆن:</p>
              {editingField === "phone" ? (
                <input
                  autoFocus
                  value={current.phone}
                  onChange={(e) => changeValue("phone", e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-left"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit("phone")}
                  className="w-full text-right p-2 rounded-lg hover:bg-white/60"
                >
                  {current.phone}
                </button>
              )}
            </div>

            <div>
              <p className="font-bold text-slate-700 mb-1">ناونیشان:</p>
              {editingField === "address" ? (
                <textarea
                  autoFocus
                  rows={3}
                  value={current.address}
                  onChange={(e) => changeValue("address", e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-right"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit("address")}
                  className="w-full text-right p-2 rounded-lg hover:bg-white/60 leading-6"
                >
                  {current.address}
                </button>
              )}
            </div>

            <div>
              <p className="font-bold text-slate-700 mb-1">کۆدی پۆستی:</p>
              {editingField === "postalCode" ? (
                <input
                  autoFocus
                  value={current.postalCode}
                  onChange={(e) => changeValue("postalCode", e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600 text-left"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit("postalCode")}
                  className="w-full text-right p-2 rounded-lg hover:bg-white/60"
                >
                  {current.postalCode}
                </button>
              )}
            </div>

            <div className="flex gap-2 items-center mt-2">
              <Instagram size={16} />
              <img src="/tiktok.svg" alt="" />
            </div>

            <p className="mt-2">
              <span className="font-bold text-slate-700">ڕێکەوتی تۆماربوون:</span>{" "}
              {current.registerDate}
            </p>
          </div>

          <div className="bg-slate-200/50 p-3 rounded-lg space-y-2 text-sm">
            <p className="flex justify-between">
              <span>کۆی قازانجی خالص:</span>
              <span className="font-bold">{netProfit.toLocaleString()} IQD</span>
            </p>
            <p className="flex justify-between">
              <span>کۆی کڕین:</span>
              <span className="font-bold">
                {totalPurchase.toLocaleString()} IQD
              </span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              disabled={saving}
              onClick={handleSave}
              className="bg-slate-800 text-white py-2 rounded-lg text-xs hover:bg-slate-900"
            >
              پاشەکەوتکردن
            </button>
            <button
              disabled={saving}
              onClick={handleDelete}
              className="bg-slate-400 text-white py-2 rounded-lg text-xs hover:bg-slate-500"
            >
              سڕینەوە
            </button>
            <button
              disabled={saving}
              onClick={handleBlockToggle}
              className="bg-slate-400 text-white py-2 rounded-lg text-xs hover:bg-slate-500"
            >
              {blockBtnText}
            </button>
          </div>

          {loading ? (
            <div className="text-xs text-slate-500 pt-2 text-right">
              لە حالەتی وەرگرتندا...
            </div>
          ) : null}
        </div>

        <div className="w-full bg-slate-50 lg:w-2/3">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-3 rounded-r-lg">سەبەتەکانی کڕین</th>
                  <th className="p-3">قازانجی خالص</th>
                  <th className="p-3 rounded-l-lg">کۆی بڕ</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr
                    key={`${h.id}-${i}`}
                    className="bg-white border-b border-gray-50 hover:bg-slate-50"
                  >
                    <td className="p-4 font-bold">{h.id}</td>
                    <td className="p-4">{h.profit}</td>
                    <td className="p-4">{h.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-3">
            <h3 className="text-right font-bold text-slate-800">سەبەتەکانی کڕین</h3>

            {history.map((h, i) => {
              const isOpen = openCartId === h.id;

              return (
                <div
                  key={`${h.id}-${i}`}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleCart(h.id)}
                    className="w-full flex items-center justify-between px-4 py-4"
                  >
                    <span className="font-bold text-slate-800">{h.id}</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden px-4 pb-4 text-sm text-slate-700 space-y-3">
                      <div className="flex justify-between items-center pt-4 md:pt-0">
                        <span className="font-semibold">قازانجی خالص:</span>
                        <span>{h.profit}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="font-semibold">کۆی بڕ:</span>
                        <span className="font-bold">{h.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {history.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">
                {loading ? "لە حالەتی وەرگرتندا..." : "هیچ داتایەک بۆ پیشاندان نییە"}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default UserProfileModal;
