import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import ProductsTable from "../sections/products/ProductsTable";
import Sidebar from "../layout/Sidebar";
import TopBar from "../layout/TopBar";
import { fetchProducts } from "../../services/products.service.js";

// fallback mock
const initialProducts = [
  { id: 1, name: "عەترێکی ژنانه‌ فلۆرال", price: "6,440,000 IQD", stock: 250, expire: "1404/11/30", img: "/mini.png" },
  { id: 2, name: "عەترێکی پیاوانە کلاسیک", price: "4,200,000 IQD", stock: 15, expire: "1405/02/15", img: "/mini2.png" },
  { id: 3, name: "کرێمی نەمناککەر", price: "1,150,000 IQD", stock: 0, expire: "1404/12/20", img: "/mini3.png" },
  { id: 4, name: "شامپۆی دژ بە ڕیزان", price: "980,000 IQD", stock: 50, expire: "1405/01/10", img: "/mini4.png" },
  { id: 5, name: "ڕۆغنی ئارگان", price: "2,500,000 IQD", stock: 5, expire: "1405/03/05", img: "/mini5.png" },
];

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:4000/api/v1";

const API_ORIGIN = API_BASE.replace(/\/api\/v1$/, "");

function resolveAssetUrl(u) {
  if (!u) return "/mini.png";
  if (typeof u !== "string") return "/mini.png";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/uploads/")) return `${API_ORIGIN}${u}`;
  return u;
}

function safeFaDate(d) {
  try {
    return new Date(d).toLocaleDateString("fa-IR");
  } catch {
    return "-";
  }
}

function normalizeProductForUI(p) {
  const stockNum = Number(p?.stock ?? 0);
  const baseIsActive = p?.isActive ?? p?.active ?? true;

  return {
    id: p?._id || p?.id,
    name: p?.name_fa || p?.name_en || p?.name || p?.title || "—",
    price: p?.price != null ? `${Number(p.price).toLocaleString()} IQD` : "—",
    stock: Number.isFinite(stockNum) ? stockNum : 0,
    expire: p?.expireDate
      ? safeFaDate(p.expireDate)
      : p?.expiryDate
      ? safeFaDate(p.expiryDate)
      : "—",
    img: resolveAssetUrl(p?.mainImage || p?.image),
    // ✅ UI uses `active` but backend uses `isActive`
    // ✅ rule: stock=0 => auto inactive
    active: Boolean(baseIsActive) && Number(stockNum) > 0,
    __raw: p,
  };
}

export default function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const { items } = await fetchProducts({ limit: 100, sort: "-createdAt" });
        const normalized = (items || []).map(normalizeProductForUI);

        if (!alive) return;
        setProducts(normalized.length ? normalized : []);
      } catch (e) {
        console.error("fetchProducts failed:", e);
        if (!alive) return;
        setProducts(initialProducts);
      }
    })();

    return () => {
      alive = false;
    };
  }, [location.key]);

  return (
    <DashboardLayout topbar={<TopBar />} sidebar={<Sidebar />}>
      <div className="bg-white rounded-[20px] shadow-sm p-6 lg:mt-12 md:mt-24 mt-16">
        <ProductsTable products={products} setProducts={setProducts} />
      </div>
    </DashboardLayout>
  );
}
