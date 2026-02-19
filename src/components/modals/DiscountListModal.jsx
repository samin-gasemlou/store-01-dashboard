import React, { useEffect, useState } from "react";
import BaseModal from "../ui/BaseModal";
import { Download, BarChart2, Settings, ChevronDown } from "lucide-react";
import DiscountDetailsModal from "./DiscountDetailsModal";
import * as XLSX from "xlsx";

import {
  listPromoCodes,
  createPromoCode,
  updatePromoCode,
} from "../../services/promoCodes.service.js";

function toFaDate(d) {
  try {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("fa-IR");
  } catch {
    return "—";
  }
}

// ✅ گرنگ: هەندێک باک‌اند name نییە / یان تۆمارە کۆنەکان name نییە
// fallback: name -> title -> label
function normalizePromoForUI(p) {
  const id = String(p?._id || p?.id || "");
  const name =
    (p?.name || "").toString().trim() ||
    (p?.title || "").toString().trim() ||
    (p?.label || "").toString().trim() ||
    "—";

  const code = (p?.code || "—").toString().trim();
  const percent = `${Number(p?.discountPercent ?? p?.percent ?? 0)}%`;
  const date = p?.expiresAt ? toFaDate(p.expiresAt) : "—";

  // بۆ input type="date" لە مۆداڵ: YYYY-MM-DD
  const dateInput =
    p?.expiresAt ? new Date(p.expiresAt).toISOString().slice(0, 10) : "";

  return { id, name, code, percent, date, dateInput, __raw: p };
}

const DiscountListModal = ({ isOpen, onClose }) => {
  const [openId, setOpenId] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const toggleRow = (id) => setOpenId((prev) => (prev === id ? null : id));

  const openAddModal = () => {
    setEditingItem(null);
    setDetailsOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setDetailsOpen(true);
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await listPromoCodes();
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setDiscounts(list.map(normalizePromoForUI));
    } catch (e) {
      console.error("listPromoCodes failed:", e);
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    refresh();
  }, [isOpen]);

  const handleDownloadExcel = () => {
    if (!discounts || !discounts.length) return;

    const excelData = discounts.map((d) => ({
      "ناوی کۆدی داشکاندن": d.name,
      "ڕێکەوتی بەسەرچوون": d.date,
      "کۆدی داشکاندن": d.code,
      "ڕێژەی داشکاندن": d.percent,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PromoCodes");
    XLSX.writeFile(wb, "promocodes.xlsx");
  };

  const handleSaveDiscount = async (payload) => {
    const percentNum = Number(String(payload.percent || "").replace("%", "").trim());
    const expiresAt = payload.date ? new Date(payload.date).toISOString() : null;

    const body = {
      name: String(payload.name || "").trim(),
      code: String(payload.code || "").trim().toUpperCase(),
      discountPercent: Number.isFinite(percentNum) ? percentNum : 0,
      expiresAt,
    };

    if (!body.name) return alert("تکایە ناوی داشکاندن بنووسە");

    try {
      setLoading(true);
      if (payload.id) await updatePromoCode(payload.id, body);
      else await createPromoCode(body);

      await refresh();
    } catch (e) {
      console.error("save promo failed:", e);
      alert(e?.message || "پاشەکەوتکردنی کۆدی داشکاندن سەرکەوتوو نەبوو");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BaseModal isOpen={isOpen} onClose={onClose} title="لیستی کۆدەکانی داشکاندن" size="xl">
        {/* Top Actions */}
        <div className="flex justify-end gap-4 items-center mb-6">
          <button
            onClick={handleDownloadExcel}
            className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-300 text-sm"
          >
            <Download size={16} />
            Excel
          </button>

          <button
            onClick={openAddModal}
            className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 text-sm"
          >
            زیادکردنی کۆدی داشکاندن
          </button>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-slate-600">
                <th className="pb-3 font-semibold">ناوی کۆدی داشکاندن</th>
                <th className="pb-3 font-semibold text-center">ڕێکەوتی بەسەرچوون</th>
                <th className="pb-3 font-semibold text-center">کۆدی داشکاندن</th>
                <th className="pb-3 font-semibold text-center">ڕێژەی داشکاندن</th>
                <th className="pb-3 font-semibold text-left pl-4">دەستپێگەیشتن</th>
              </tr>
            </thead>

            <tbody className="text-sm text-slate-800">
              {discounts.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 font-medium">{item.name}</td>
                  <td className="py-4 text-center text-gray-500">{item.date}</td>
                  <td className="py-4 text-center font-mono text-slate-600">{item.code}</td>
                  <td className="py-4 text-center font-bold">{item.percent}</td>

                  <td className="py-4 flex justify-end gap-3 pl-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-slate-500 hover:text-blue-600"
                    >
                      <Settings size={18} />
                    </button>

                    <button className="text-slate-500 hover:text-blue-600">
                      <BarChart2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading ? (
            <div className="pt-3 text-right text-xs text-slate-500">لە حالەتی وەرگرتندا...</div>
          ) : null}
        </div>

        {/* MOBILE */}
        <div className="md:hidden space-y-3">
          {discounts.map((item) => {
            const isOpenRow = openId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-[10px] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleRow(item.id)}
                  className="w-full flex items-center justify-between px-4 py-4"
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${isOpenRow ? "rotate-180" : ""}`}
                  />
                  <span className="font-medium text-slate-800 text-right">{item.name}</span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpenRow ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden px-4 pb-4 text-sm text-slate-700 space-y-3">
                    <div className="flex items-center justify-between py-3">
                      <span className="font-semibold text-right">ڕێکەوتی بەسەرچوون:</span>
                      <span className="text-gray-500 text-left break-all">{item.date}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold">کۆدی داشکاندن:</span>
                      <span className="font-mono text-slate-600 break-all">{item.code}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold">ڕێژەی داشکاندن:</span>
                      <span className="font-bold">{item.percent}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="font-semibold">دەستپێگەیشتن:</span>
                      <div className="flex gap-5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-slate-500 hover:text-blue-600 p-2"
                        >
                          <Settings size={18} />
                        </button>
                        <button className="text-slate-500 hover:text-blue-600 p-2">
                          <BarChart2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {loading ? (
            <div className="pt-2 text-right text-xs text-slate-500">لە حالەتی وەرگرتندا...</div>
          ) : null}
        </div>
      </BaseModal>

      <DiscountDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        initialData={editingItem}
        onSave={handleSaveDiscount}
      />
    </>
  );
};

export default DiscountListModal;
