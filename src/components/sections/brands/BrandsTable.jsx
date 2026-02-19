import { useEffect, useMemo, useState } from "react";
import BrandRow from "./BrandRow.jsx";
import MobileBrandRow from "./MobileBrandRow.jsx";
import EditBrandModal from "../../modals/EditBrandModal.jsx";
import {
  fetchBrands,
  deleteBrand as deleteBrandApi,
} from "../../../services/brands.service.js";

function unwrapBrands(out) {
  if (!out) return [];

  // 1) ئەگەر خود خروجی آرایه بود
  if (Array.isArray(out)) return out;

  // 2) ئەگەر axios-style بود => out.data
  const payload = out?.data ?? out;

  // 3) شکل بک شما => { total,page,limit,data:[...] }
  if (Array.isArray(payload?.data)) return payload.data;

  // 4) بعضی جاها => { items:[...] }
  if (Array.isArray(payload?.items)) return payload.items;

  // 5) حالت خیلی wrapperدار => { data:{ data:[...] } }
  if (Array.isArray(payload?.data?.data)) return payload.data.data;

  return [];
}

export default function BrandsTable() {
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);

  const rows = useMemo(() => brands, [brands]);

  const load = async () => {
    try {
      setLoading(true);
      const out = await fetchBrands({ page: 1, limit: 200 });
      setBrands(unwrapBrands(out));
    } catch (e) {
      console.error(e);
      alert(e?.message || "وەرگرتنی لیستی براندەکان سەرکەوتوو نەبوو");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = (b) => {
    setSelected(b);
    setEditOpen(true);
  };

  const handleDelete = async (b) => {
    if (!b?._id) return;
    if (!confirm("بسڕدرێتەوە؟")) return;

    const snapshot = brands;
    setBrands((p) => p.filter((x) => x._id !== b._id));

    try {
      await deleteBrandApi(b._id);
    } catch (e) {
      console.error(e);
      setBrands(snapshot);
      alert(e?.message || "سڕینەوە سەرکەوتوو نەبوو");
    }
  };

  return (
    <div className="bg-white border border-[#0000000D] rounded-2xl shadow-sm p-6">
      <h2 className="text-right text-[#273959] font-bold text-[20px] mb-6">
        لیستی براندەکان
      </h2>

      <div className="hidden md:block">
        <div className="flex flex-row items-center justify-between text-[15px] font-extrabold pb-3 border-b-2 border-b-[#0000004D] px-4">
          <div className="flex gap-12">
            <span>کردارەکان</span>
            <span>ژمارەی بەرهەمی بەردەست</span>
          </div>
          <div className="flex gap-12">
            <span>ناوی براند</span>
          </div>
        </div>

        <div className="divide-y px-4">
          {loading ? (
            <div className="py-6 text-center text-sm text-gray-500">
              لە حالەتی وەرگرتندا...
            </div>
          ) : rows.length ? (
            rows.map((b) => (
              <BrandRow
                key={String(b?._id || b?.name || Math.random())}
                brand={b}
                onEdit={() => handleEdit(b)}
                onDelete={() => handleDelete(b)}
              />
            ))
          ) : (
            <div className="py-6 text-center text-sm text-gray-500">
              هیچ براندێک نییە
            </div>
          )}
        </div>
      </div>

      <div className="block md:hidden space-y-3">
        {loading ? (
          <div className="py-6 text-center text-sm text-gray-500">
            لە حالەتی وەرگرتندا...
          </div>
        ) : rows.length ? (
          rows.map((b) => (
            <MobileBrandRow
              key={String(b?._id || b?.name || Math.random())}
              brand={b}
              onEdit={() => handleEdit(b)}
              onDelete={() => handleDelete(b)}
            />
          ))
        ) : (
          <div className="py-6 text-center text-sm text-gray-500">
            هیچ براندێک نییە
          </div>
        )}
      </div>

      <EditBrandModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        brand={selected}
        onSaved={load}
        onDeleted={load}
      />
    </div>
  );
}
