import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { usePos } from "../context/PosContext";
import { useFeedback } from "../context/FeedbackContext";
import { formatINR } from "../data/posEngine";
import ReceiptTicket from "../components/ReceiptTicket";

function fmtDateTime(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
}

export default function SalesHistory() {
  const { sales } = usePos();
  const { locations } = useFeedback();
  const [locationId, setLocationId] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(
    () => sales.filter((s) => locationId === "all" || s.locationId === locationId),
    [sales, locationId]
  );

  const totalRevenue = filtered.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-sage">
          {filtered.length} sale{filtered.length === 1 ? "" : "s"} this session
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight mt-1">Sales history</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white border border-line rounded-lg p-5">
          <p className="text-xs uppercase tracking-wide text-ink/50 font-medium">Revenue</p>
          <p className="font-mono text-3xl font-semibold mt-2 text-sage">{formatINR(totalRevenue)}</p>
        </div>
        <div className="bg-white border border-line rounded-lg p-5">
          <p className="text-xs uppercase tracking-wide text-ink/50 font-medium">Transactions</p>
          <p className="font-mono text-3xl font-semibold mt-2">{filtered.length}</p>
        </div>
        <div className="bg-white border border-line rounded-lg p-5">
          <p className="text-xs uppercase tracking-wide text-ink/50 font-medium">Avg. ticket</p>
          <p className="font-mono text-3xl font-semibold mt-2">
            {formatINR(filtered.length ? totalRevenue / filtered.length : 0)}
          </p>
        </div>
      </div>

      <select
        value={locationId}
        onChange={(e) => setLocationId(e.target.value)}
        className="text-sm font-mono bg-white border border-line rounded-md px-3 py-1.5 outline-none"
      >
        <option value="all">All locations</option>
        {locations.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>

      {filtered.length === 0 ? (
        <p className="text-sm text-ink/50 bg-white border border-line rounded-lg p-10 text-center">
          No sales yet this session — completed checkouts will show up here.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const loc = locations.find((l) => l.id === s.locationId);
            const isOpen = expanded === s.id;
            return (
              <div key={s.id} className="bg-white border border-line rounded-md overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : s.id)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-ink/50">
                      #{s.id.slice(-6)} · {fmtDateTime(s.date)}
                    </span>
                    <span className="font-mono text-xs text-ink/40">· {loc?.name}</span>
                    <span className="text-xs font-mono bg-paper-dim border border-line px-1.5 py-0.5 rounded">
                      {s.paymentMethod}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold">{formatINR(s.total)}</span>
                    <ChevronDown
                      size={16}
                      className={`text-ink/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <ReceiptTicket sale={s} locationName={loc?.name} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
