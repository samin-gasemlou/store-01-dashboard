import React, { useMemo, useState } from "react";
import BaseModal from "../ui/BaseModal";
import { Instagram, ChevronDown } from "lucide-react";
import { changeOrderStatus } from "../../services/orders.service.js";

const statusLabelMap = {
  PENDING: "لە چاوەڕوانی پێداچوونەوە",
  ACCEPTED: "پەسەندکراوە",
  COMPLETE: "تەواوبوو",
  CANCELED: "هەڵوەشاوە",
};

const OrderDetailsModal = ({ isOpen, onClose, order, onAfterChange }) => {
  const modalKey = useMemo(() => {
    if (!isOpen) return "closed";
    return order?.id ? `order-${order.id}` : "order-empty";
  }, [isOpen, order?.id]);

  const [openProductId, setOpenProductId] = useState(null);
  const [saving, setSaving] = useState(false);

  const products = useMemo(() => {
    const items = order?.items || [];

    return items.map((it, idx) => {
      const p = it.product || {};
      const name = p.name_en || p.name || it.name || `بەرهەم ${idx + 1}`;
      const price = it.price != null ? `${Number(it.price).toLocaleString()} IQD` : "-";
      const count = it.quantity != null ? `${it.quantity} دانە` : "-";
      const total =
        it.price != null && it.quantity != null
          ? `${Number(it.price * it.quantity).toLocaleString()} IQD`
          : "-";
      const img = p.mainImage || p.img || "/product-thumb.png";

      return {
        id: String(p._id || it.product || it._id || idx),
        name,
        price,
        count,
        total,
        img,
      };
    });
  }, [order?.items]);

  const toggleProduct = (id) => setOpenProductId((p) => (p === id ? null : id));

  const doChangeStatus = async (newStatus) => {
    const id = order?.id;
    if (!id) return alert("ID ی داواکاری نادروستە");

    try {
      setSaving(true);
      await changeOrderStatus(id, { status: newStatus, note: "" });
      alert("دۆخی داواکاری بە سەرکەوتوویی گۆڕا");
      onAfterChange?.();
    } catch (e) {
      console.error(e);
      alert(e?.message || "گۆڕینی دۆخ سەرکەوتوو نەبوو");
    } finally {
      setSaving(false);
    }
  };

  const titleNo = order?.invoiceNumber || order?.id || "";
  const rawStatus = String(order?.rawStatus || "PENDING").toUpperCase();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`وردەکاری داواکاری : #${titleNo}`}
      size="xl"
    >
      <div key={modalKey} className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 bg-slate-100/50 p-5 rounded-xl space-y-4 h-fit border border-slate-100">
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-bold text-slate-700">ناو:</span>{" "}
              {order?.customer ?? "-"}
            </p>
            <p>
              <span className="font-bold text-slate-700">ژمارەی تەلەفۆن:</span>{" "}
              {order?.user?.phone1 ?? "—"}
            </p>
            <p className="leading-6">
              <span className="font-bold text-slate-700">ناونیشان:</span>{" "}
              {order?.address ?? "—"}
            </p>
            <p>
              <span className="font-bold text-slate-700">شار:</span>{" "}
              {order?.city ?? "—"}
            </p>
          </div>

          <div className="flex gap-2 items-center text-sm">
            <span className="font-bold text-slate-700">سۆشیال میدیا:</span>
            <img src="/tiktok.svg" alt="" />
            <Instagram size={18} className="text-pink-600" />
          </div>

          <div className="border-t border-gray-200 my-2 pt-2 space-y-2 text-sm">
            <p className="flex justify-between">
              <span>ڕێکەوتی تۆمارکردن:</span>
              <span>{order?.date ?? "-"}</span>
            </p>
            <p className="flex justify-between font-bold text-slate-800">
              <span>کۆد:</span>
              <span>{titleNo || "-"}</span>
            </p>
            <p className="flex justify-between font-medium">
              <span>دۆخ:</span>
              <span className="text-green-600">
                {statusLabelMap[rawStatus] || rawStatus}
              </span>
            </p>
          </div>

          <div className="space-y-1 pt-2 flex flex-col items-start justify-center gap-2 w-full">
            <span className="text-xs font-bold text-slate-500">پێداچوونەوەی داواکاری:</span>

            <div className="flex gap-2 w-full">
              <button
                disabled={saving}
                onClick={() => doChangeStatus("ACCEPTED")}
                className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-sm hover:bg-slate-900 disabled:opacity-60"
              >
                پەسەندکردن
              </button>
              <button
                disabled={saving}
                onClick={() => doChangeStatus("CANCELED")}
                className="flex-1 bg-slate-400 text-white py-2 rounded-lg text-sm hover:bg-slate-500 disabled:opacity-60"
              >
                هەڵوەشاندنەوە
              </button>
            </div>

            <div className="flex gap-2 w-full">
              <button
                disabled={saving}
                onClick={() => doChangeStatus("COMPLETE")}
                className="flex-1 bg-emerald-700 text-white py-2 rounded-lg text-sm hover:bg-emerald-800 disabled:opacity-60"
              >
                تەواوکردن
              </button>
              <button
                disabled={saving}
                onClick={() => doChangeStatus("PENDING")}
                className="flex-1 bg-amber-600 text-white py-2 rounded-lg text-sm hover:bg-amber-700 disabled:opacity-60"
              >
                چاوەڕوانی
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <h3 className="text-right font-bold text-slate-800 mb-3">بەرهەمەکان</h3>

          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-6">
                هیچ بەرهەمێک بۆ ئەم داواکاریە تۆمارنەکراوە
              </div>
            ) : (
              products.map((p) => {
                const isOpen = openProductId === p.id;

                return (
                  <div
                    key={p.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleProduct(p.id)}
                      className="w-full flex items-center justify-between px-4 py-4"
                    >
                      <span className="font-medium text-slate-800 text-right">
                        {p.name}
                      </span>
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
                        <div className="flex items-center justify-between py-5">
                          <span className="font-semibold">نرخی یەکدانە:</span>
                          <span className="text-gray-500">{p.price}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-semibold">ژمارە:</span>
                          <span className="text-gray-700">{p.count}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-semibold">کۆی بڕ:</span>
                          <span className="font-bold text-slate-900">{p.total}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="font-semibold">وێنە:</span>
                          <img
                            src={p.img}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-contain bg-slate-50 border"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default OrderDetailsModal;
