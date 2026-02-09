import ProductsRow from "./ProductsRow";
import ProductsHeader from "./ProductsHeader";
import MobileProductRow from "./MobileProductRow";

export default function ProductsTable({ products, setProducts }) {
  const toggleActive = (id) => {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, active: !p.active } : p)
    );
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="w-full">
      <ProductsHeader products={products} setProducts={setProducts} />

      {/* ================= Desktop (UNCHANGED) ================= */}
      <div className="hidden md:block overflow-x-auto w-full">
        <table className="w-full text-right border-collapse min-w-150">
          <thead>
            <tr className="text-[13px] sm:text-[14px] md:text-[15px] border-b-2 border-b-[#0000004D]">
              <th className="py-2 px-8 flex justify-start">عملیات</th>
              <th>تاریخ انقضا</th>
              <th>موجودی</th>
              <th>قیمت فروش</th>
              <th>نام محصول</th>
              <th className="px-2">تصویر</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <ProductsRow
                key={p.id}
                product={p}
                toggleActive={toggleActive}
                deleteProduct={deleteProduct}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= Mobile & Tablet ================= */}
      <div className="md:hidden space-y-3">
        {products.map(p => (
          <MobileProductRow
            key={p.id}
            product={p}
            toggleActive={toggleActive}
            deleteProduct={deleteProduct}
          />
        ))}
      </div>
    </div>
  );
}
