import { useCallback, useEffect, useState } from "react";
import { fetchReportsRange } from "../services/reports.service.js";

function isoDateOnly(d) {
  const x = new Date(d);
  const yyyy = x.getFullYear();
  const mm = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function useReportDashboard({ days = 7, limit = 10 } = {}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [startDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - (Math.max(1, Number(days) || 7) - 1));
    return isoDateOnly(d);
  });

  const [endDate] = useState(() => isoDateOnly(new Date()));

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const out = await fetchReportsRange({ startDate, endDate, limit });
      setData(out);
    } catch (e) {
      console.error("fetchReportsRange failed:", e);
      setError(e);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { loading, data, error, startDate, endDate, refresh };
}
