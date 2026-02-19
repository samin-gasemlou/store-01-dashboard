import { useEffect, useState, useTransition } from "react";
import { fetchOrders } from "../services/orders.service.js";

function safeFaDate(d) {
  try {
    return new Date(d).toLocaleDateString("fa-IR");
  } catch {
    return "-";
  }
}

const statusLabelMap = {
  PENDING: "لە انتظار بررسی",
  ACCEPTED: "پذیرفته کراوە",
  COMPLETE: "تکمیل کراوە",
  CANCELED: "لغو کراوە",
};

function computeTotalFromItems(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, it) => {
    const p = Number(it?.price ?? 0);
    const q = Number(it?.quantity ?? 0);
    return sum + p * q;
  }, 0);
}

function normalizeOrderForUI(o) {
  const id = String(o?._id || o?.id || "");
  const invoiceNo = o?.invoiceNumber ? String(o.invoiceNumber) : id;

  // ✅ user ممکنه لە userId یان user بیاد
  const user = o?.userId || o?.user || {};
  const customerName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const customer = customerName || user?.phone1 || user?.phone || o?.customer || "-";

  const rawStatus = String(o?.status || "PENDING").toUpperCase();

  // ✅ total ئەگەر نبود لە items جمع بزن
  const computedTotal = computeTotalFromItems(o?.items);
  const total = o?.total ?? computedTotal;

  const invoice = `${Number(total || 0).toLocaleString()} IQD`;

  return {
    id,
    invoiceNumber: invoiceNo,
    total, // ✅
    invoice,
    rawStatus,
    status: statusLabelMap[rawStatus] || rawStatus,
    date: o?.createdAt ? safeFaDate(o.createdAt) : "-",
    customer,
    user: user || null,
    address: o?.address ?? "",
    city: o?.city ?? "",
    items: Array.isArray(o?.items) ? o.items : [],
    __raw: o,
  };
}

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);

        const { items } = await fetchOrders({ page: 1, limit: 50, sort: "-createdAt" });

        const normalized = (items || [])
          .filter((x) => x && (x._id || x.id))
          .map(normalizeOrderForUI);

        startTransition(() => {
          if (mounted) setOrders(normalized);
        });
      } catch (e) {
        console.error("useOrders fetch failed:", e);
        startTransition(() => {
          if (mounted) setOrders([]);
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  return {
    orders,
    setOrders,
    loading: loading || isPending,
  };
}
