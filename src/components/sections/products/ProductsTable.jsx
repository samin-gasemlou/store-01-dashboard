import { useNavigate } from "react-router-dom";
import ProductsRow from "./ProductsRow";
import ProductsHeader from "./ProductsHeader";
import MobileProductRow from "./MobileProductRow";
import {
  deleteProduct as deleteProductApi,
  updateProduct as updateProductApi,
} from "../../../services/products.service.js";

function getId(p) {
  return p?.id ?? p?._id ?? p?.productId ?? null;
}

export default function ProductsTable({ products, setProducts }) {
  const nav = useNavigate();

  const toggleActive = async (id) => {
    if (!id) return;

    const current = products.find((p) => String(getId(p)) === String(id));
    if (!current) return;

    const stockNum = Number(current.stock ?? 0);
    const nextActive = !current.active;

    if (nextActive === true && stockNum === 0) {
      setProducts((prev) =>
        prev.map((p) =>
          String(getId(p)) === String(id) ? { ...p, active: false } : p
        )
      );
      alert("بۆ چالاککردنی بەرهەم، سەرەتا کۆگا زیاتر بکە لە 0.");
      return;
    }

    const backendPatch = nextActive
      ? { isActive: true, isHidden: false }
      : { isActive: false, isHidden: true };

    let snapshot = null;
    setProducts((prev) => {
      snapshot = prev;
      return prev.map((p) =>
        String(getId(p)) === String(id) ? { ...p, active: nextActive } : p
      );
    });

    try {
      await updateProductApi(id, backendPatch);
    } catch (e) {
      if (snapshot) setProducts(snapshot);
      alert(e?.message || "گۆڕینی دۆخی چالاک/ناچالاک سەرکەوتوو نەبوو");
    }
  };

  const deleteProduct = async (id) => {
    if (!id) return;

    let snapshot = null;
    setProducts((prev) => {
      snapshot = prev;
      return prev.filter((x) => String(getId(x)) !== String(id));
    });

    try {
      await deleteProductApi(id);
    } catch (e) {
      if (snapshot) setProducts(snapshot);
      alert(e?.message || "سڕینەوەی بەرهەم سەرکەوتوو نەبوو");
    }
  };

  const editProduct = (product) => {
    nav("/products/add", {
      state: {
        mode: "edit",
        productId: getId(product),
        product,
      },
    });
  };

  return (
    <div className="w-full">
      <ProductsHeader products={products} setProducts={setProducts} />

      <div className="hidden md:block overflow-x-auto w-full">
        <table className="w-full text-right border-collapse min-w-150">
          <thead>
            <tr className="text-[13px] sm:text-[14px] md:text-[15px] border-b-2 border-b-[#0000004D]">
              <th className="py-2 px-8 flex justify-start">کردارەکان</th>
              <th>ڕێکەوتی بەسەرچوون</th>
              <th>کۆگا</th>
              <th>نرخی فرۆشتن</th>
              <th>ناوی بەرهەم</th>
              <th className="px-2">وێنە</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <ProductsRow
                key={String(getId(p))}
                product={p}
                toggleActive={toggleActive}
                deleteProduct={deleteProduct}
                editProduct={editProduct}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {products.map((p) => (
          <MobileProductRow
            key={String(getId(p))}
            product={p}
            toggleActive={toggleActive}
            deleteProduct={deleteProduct}
            editProduct={editProduct}
          />
        ))}
      </div>
    </div>
  );
}
