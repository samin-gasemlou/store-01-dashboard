// dashboard/src/hooks/useOrders.js
import { useEffect, useState, useTransition } from "react";
import { fetchOrders } from "../services/orders.service.js";

function safeFaDate(d) {
  try {
    return new Date(d).toLocaleDateString("fa-IR");
  } catch {
    return "-";
  }
}

function normalizeOrderForUI(o) {
  const id = o?._id || o?.id || o?.invoiceNumber || "-";

  const invoice = o?.total != null
    ? `${Number(o.total).toLocaleString()} IQD`
    : (o?.invoiceNumber || "-");

  const user = o?.userId || o?.user || {};
  const customer =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.phone1 ||
    o?.customer ||
    "-";

  // UI شما فارسی/انگلیسی قاطیه. اینجا فقط همون چیزی که داری رو حفظ می‌کنیم:
  const status = o?.status || "pending";

  const statusLabelMap = {
    pending: "در انتظار بررسی",
    complete: "تکمیل شده",
    rejected: "لغو شده",
    canceled: "لغو شده",
  };

  return {
    id,
    invoice,
    status: statusLabelMap[status] || status,
    date: o?.createdAt ? safeFaDate(o.createdAt) : (o?.date || "-"),
    customer,
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

        const { items } = await fetchOrders({ limit: 50, sort: "-createdAt" });

        const normalized = (items || []).map(normalizeOrderForUI);

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
  }, [startTransition]);

  return {
    orders,
    setOrders,
    loading: loading || isPending,
  };
}
