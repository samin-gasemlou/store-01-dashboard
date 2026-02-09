import {
  ArrowDownAZ,
  ArrowUpZA,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Archive,
  ChevronLeft,
} from "lucide-react";

const options = [
  { label: "حروف الفبا A-Z", icon: ArrowDownAZ, key: "name", ascending: true },
  { label: "حروف الفبا Z-A", icon: ArrowUpZA, key: "name", ascending: false },
  { label: "کمترین قیمت", icon: ArrowDownWideNarrow, key: "price", ascending: true },
  { label: "بیشترین قیمت", icon: ArrowUpWideNarrow, key: "price", ascending: false },
  { label: "کمترین موجودی", icon: Archive, key: "stock", ascending: true },
];

export default function SortDropdown({ products, setProducts, closeDropdown }) {
  const handleSort = (key, ascending) => {
    const sorted = [...products].sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      if (key === "price") {
        valA = Number(valA.replace(/[^0-9]/g, ""));
        valB = Number(valB.replace(/[^0-9]/g, ""));
      }

      if (valA < valB) return ascending ? -1 : 1;
      if (valA > valB) return ascending ? 1 : -1;
      return 0;
    });

    setProducts(sorted);
    if (closeDropdown) closeDropdown();
  };

  return (
    <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg p-2 z-20">
      {options.map((item, i) => {
        const Icon = item.icon;
        return (
          <button
            key={i}
            onClick={() => handleSort(item.key, item.ascending)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-gray-100"
          >
            <span>{item.label}</span>
            <div className="flex items-center gap-2">
              <Icon size={16} />
              <ChevronLeft size={14} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
