import CategoryRow from "../categories/CategoryRow";
import MobileBrandRow from "./MobileBrandRow";

const rows = Array.from({ length: 8 });

export default function BrandsTable() {
  return (
    <div className="bg-white border border-[#0000000D] rounded-2xl shadow-sm p-6">

      <h2 className="text-right text-[#273959] font-bold text-[20px] mb-6">
        لیست دسته بندی ها
      </h2>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <div className="flex flex-row items-center justify-between text-[15px] font-extrabold pb-3 border-b-2 border-b-[#0000004D] px-4">
          <div className="flex gap-12">
            <span>عملیات</span>
            <span>تعداد محصول موجود</span>
          </div>

          <div className="flex gap-12">
            <span>نام دسته بندی</span>
            <span>تصویر دسته بندی</span>
          </div>
        </div>

        <div className="divide-y px-4">
          {rows.map((_, i) => (
            <CategoryRow key={i} />
          ))}
        </div>
      </div>

      {/* MOBILE & TABLET */}
      <div className="block md:hidden space-y-3">
        {rows.map((_, i) => (
          <MobileBrandRow key={i} />
        ))}
      </div>

    </div>
  );
}
