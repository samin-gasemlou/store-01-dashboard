import BaseModal from "../ui/BaseModal";

function fmt(n) {
  return Number(n || 0).toLocaleString("fa-IR");
}

export default function ReportModal({ isOpen, onClose, data, loading }) {
  const customers = Array.isArray(data?.topCustomers) ? data.topCustomers : [];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="باشترین کڕیارەکان"
      size="md"
    >
      <div className="space-y-3">
        {customers.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            {loading ? "لە حالەتی وەرگرتندا..." : "هیچ داتایەک بۆ پیشاندان نییە"}
          </div>
        ) : (
          customers.map((c, idx) => (
            <div
              key={c.userId || `${c.phone}-${idx}`}
              className="flex items-center justify-between bg-white border border-[#0000000D] rounded-xl p-4"
            >
              <div className="text-right">
                <div className="font-bold text-slate-800">{c.name || "—"}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {c.phone || "—"} • داواکاریەکان: {fmt(c.orders)}
                </div>
              </div>

              <div className="text-left">
                <div className="text-sm font-bold">{fmt(c.total)} IQD</div>
                <div className="text-xs text-slate-500">کۆی کڕین</div>
              </div>
            </div>
          ))
        )}
      </div>
    </BaseModal>
  );
}
