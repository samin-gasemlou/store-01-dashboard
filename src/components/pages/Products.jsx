import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import ProductsTable from "../sections/products/ProductsTable";
import Sidebar from "../layout/Sidebar";
import TopBar from "../layout/TopBar";

// ماک دیتا محصولات
const initialProducts = [
  { id: 1, name: "عطر زنانه فلورال", price: "6,440,000 IQD", stock: 250, expire: "1404/11/30", img: "/mini.png" },
  { id: 2, name: "عطر مردانه کلاسیک", price: "4,200,000 IQD", stock: 15, expire: "1405/02/15", img: "/mini2.png" },
  { id: 3, name: "کرم مرطوب‌کننده", price: "1,150,000 IQD", stock: 0, expire: "1404/12/20", img: "/mini3.png" },
  { id: 4, name: "شامپو ضد ریزش", price: "980,000 IQD", stock: 50, expire: "1405/01/10", img: "/mini4.png" },
  { id: 5, name: "روغن آرگان", price: "2,500,000 IQD", stock: 5, expire: "1405/03/05", img: "/mini5.png" },
];

export default function Products() {
  const [products, setProducts] = useState(initialProducts);

  return (
    <DashboardLayout topbar={<TopBar />} sidebar={<Sidebar />}>
      <div className="bg-white rounded-2xl shadow-sm p-6 lg:mt-12 md:mt-24 mt-20">
        <ProductsTable products={products} setProducts={setProducts} />
      </div>
    </DashboardLayout>
  );
}
