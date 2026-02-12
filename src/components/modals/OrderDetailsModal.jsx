import React, { useState } from "react";
import BaseModal from "../ui/BaseModal";
import { Instagram, Music2, ChevronDown } from "lucide-react";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  const [openProductId, setOpenProductId] = useState(null);

  const products = [
    { id: 1, name: "کرم آبرسان سبک", price: "500,000 IQD", count: "4 عدد", total: "2,000,000 IQD", img: "/product-thumb.png" },
    { id: 2, name: "عطر زنانه مدل X", price: "1,200,000 IQD", count: "1 عدد", total: "1,200,000 IQD", img: "/product-thumb.png" },
    { id: 3, name: "رژ لب مات", price: "300,000 IQD", count: "2 عدد", total: "600,000 IQD", img: "/product-thumb.png" },
  ];

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
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Info */}
        <div className="w-full md:w-1/3 bg-slate-100/50 p-5 rounded-xl space-y-4 h-fit border border-slate-100">
          <div className="space-y-1 text-sm">
            <p><span className="font-bold text-slate-700">نام:</span> {order?.customer ?? "-"}</p>
            <p><span className="font-bold text-slate-700">شماره تلفن:</span> 09120001234</p>
            <p className="leading-6"><span className="font-bold text-slate-700">آدرس:</span> تهران، خیابان آزادی، کوچه چنار، پلاک 8</p>
            <p><span className="font-bold text-slate-700">کد پستی:</span> 013465</p>
          </div>

          <div className="flex gap-2 items-center text-sm">
            <span className="font-bold text-slate-700">سوشال مدیا:</span>
             <img src="/tiktok.svg" alt="" />
            <Instagram size={18} className="text-pink-600" />
            
          </div>

          <div className="border-t border-gray-200 my-2 pt-2 space-y-2 text-sm">
            <p className="flex justify-between"><span>تاریخ ثبت:</span> <span>{order?.date ?? "-"}</span></p>
            <p className="flex justify-between font-bold text-slate-800"><span>جمع فاکتور:</span> <span>{order?.invoice ?? "-"}</span></p>
            <p className="flex justify-between font-medium">
              <span>وضعیت:</span>
              <span className="text-green-600">{order?.status ?? "-"}</span>
            </p>
          </div>

          <div className="space-y-1 pt-2 flex flex-col items-start justify-center gap-2 w-full">
            <span className="text-xs font-bold text-slate-500">بررسی سفارش:</span>
            <div className="flex gap-2 w-full">
              <button className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-sm hover:bg-slate-900">پذیرفتن</button>
              <button className="flex-1 bg-slate-400 text-white py-2 rounded-lg text-sm hover:bg-slate-500">لغو</button>
            </div>
          </div>
        </div>

        {/* Products Accordion */}
        <div className="w-full md:w-2/3">
          <h3 className="text-right font-bold text-slate-800 mb-3">محصولات</h3>

          <div className="space-y-3">
            {products.map((p) => {
              const isOpen = openProductId === p.id;

              return (
                <div key={p.id} className="bg-white  border border-gray-200 rounded-xl overflow-hidden">
                  {/* فقط نام محصول */}
                  <button
                    type="button"
                    onClick={() => toggleProduct(p.id)}
                    className="w-full flex items-center justify-between px-4 py-4"
                  >
                    
                    <span className="font-medium text-slate-800 text-right">{p.name}</span>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* جزئیات با انیمیشن نرم */}
                  <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
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
                        <img src={p.img} alt={p.name} className="w-12 h-12 rounded-lg object-contain bg-slate-50 border" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </BaseModal>
  );
};

export default OrderDetailsModal;
