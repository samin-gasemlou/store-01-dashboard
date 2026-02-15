import React, { useMemo, useState } from "react";
import BaseModal from "../ui/BaseModal";
import { Instagram, ChevronDown } from "lucide-react";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  // ✅ reset state بدون useEffect
  const modalKey = useMemo(() => {
    if (!isOpen) return "closed";
    return order?.id ? `order-${order.id}` : "order-empty";
  }, [isOpen, order?.id]);

  const [openProductId, setOpenProductId] = useState(null);

  // ✅ محصولات واقعی از بک‌اند
  const products = useMemo(() => {
    const items = order?.items || [];

    return items.map((it, idx) => {
      const p = it.product || {};
      const name = p.name_en || p.name || it.name || `محصول ${idx + 1}`;
      const price = it.price != null ? `${Number(it.price).toLocaleString()} IQD` : "-";
      const count = it.quantity != null ? `${it.quantity} عدد` : "-";
      const total = (it.price != null && it.quantity != null)
        ? `${Number(it.price * it.quantity).toLocaleString()} IQD`
        : "-";
      const img = p.mainImage || p.img || "/product-thumb.png";

      return {
        id: p._id || it._id || idx + 1,
        name,
        price,
        count,
        total,
        img,
      };
    });
  }, [order?.items]);

  const toggleProduct = (id) => {
    setOpenProductId((p) => (p === id ? null : id));
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`جزئیات سفارش : #${order?.id ?? ""}`}
      size="xl"
    >
      <div key={modalKey} className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Info */}
        <div className="w-full md:w-1/3 bg-slate-100/50 p-5 rounded-xl space-y-4 h-fit border border-slate-100">
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-bold text-slate-700">نام:</span>{" "}
              {order?.customer ?? "-"}
            </p>
            <p>
              <span className="font-bold text-slate-700">شماره تلفن:</span>{" "}
              {order?.user?.phone1 ?? "—"}
            </p>
            <p className="leading-6">
              <span className="font-bold text-slate-700">آدرس:</span>{" "}
              {order?.address ?? "—"}
            </p>
            <p>
              <span className="font-bold text-slate-700">شهر:</span>{" "}
              {order?.city ?? "—"}
            </p>
          </div>

          <div className="flex gap-2 items-center text-sm">
            <span className="font-bold text-slate-700">سوشال مدیا:</span>
            <img src="/tiktok.svg" alt="" />
            <Instagram size={18} className="text-pink-600" />
          </div>

          <div className="border-t border-gray-200 my-2 pt-2 space-y-2 text-sm">
            <p className="flex justify-between">
              <span>تاریخ ثبت:</span>
              <span>{order?.date ?? "-"}</span>
            </p>
            <p className="flex justify-between font-bold text-slate-800">
              <span>جمع فاکتور:</span>
              <span>{order?.invoice ?? "-"}</span>
            </p>
            <p className="flex justify-between font-medium">
              <span>وضعیت:</span>
              <span className="text-green-600">{order?.status ?? "-"}</span>
            </p>
          </div>

          <div className="space-y-1 pt-2 flex flex-col items-start justify-center gap-2 w-full">
            <span className="text-xs font-bold text-slate-500">بررسی سفارش:</span>
            <div className="flex gap-2 w-full">
              <button className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-sm hover:bg-slate-900">
                پذیرفتن
              </button>
              <button className="flex-1 bg-slate-400 text-white py-2 rounded-lg text-sm hover:bg-slate-500">
                لغو
              </button>
            </div>
          </div>
        </div>

        {/* Products Accordion */}
        <div className="w-full md:w-2/3">
          <h3 className="text-right font-bold text-slate-800 mb-3">محصولات</h3>

          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-6">
                محصولی برای این سفارش ثبت نشده
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
                          <span className="font-semibold">قیمت واحد:</span>
                          <span className="text-gray-500">{p.price}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-semibold">تعداد:</span>
                          <span className="text-gray-700">{p.count}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-semibold">جمع مبلغ:</span>
                          <span className="font-bold text-slate-900">{p.total}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="font-semibold">تصویر:</span>
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
