import { formatINR } from "../data/posEngine";

function fmtDateTime(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
}

export default function ReceiptTicket({ sale, locationName }) {
  return (
    <div className="ticket-tear bg-white border border-line rounded-md pt-4 pb-5 px-5 font-mono text-sm">
      <div className="text-center mb-3">
        <p className="font-display font-semibold text-base tracking-tight">Basil &amp; Ember</p>
        <p className="text-xs text-ink/50">{locationName}</p>
        <p className="text-[11px] text-ink/40 mt-1">
          #{sale.id} · {fmtDateTime(sale.date)}
        </p>
      </div>

      <div className="border-t border-dashed border-line pt-3 space-y-1.5">
        {sale.lines.map((l, i) => (
          <div key={i} className="flex justify-between gap-2">
            <span className="text-ink/80">
              {l.qty}× {l.name}
            </span>
            <span className="text-ink/80 shrink-0">{formatINR(l.price * l.qty)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-line mt-3 pt-3 space-y-1">
        <div className="flex justify-between text-ink/60">
          <span>Subtotal</span>
          <span>{formatINR(sale.subtotal)}</span>
        </div>
        {sale.autoPromo?.label && (
          <div className="flex justify-between text-sage">
            <span>{sale.autoPromo.label}</span>
            <span>-{formatINR(sale.autoPromo.amount)}</span>
          </div>
        )}
        {sale.manualDiscount && sale.manualAmount > 0 && (
          <div className="flex justify-between text-sage">
            <span>{sale.manualDiscount.reason || "Manual discount"}</span>
            <span>-{formatINR(sale.manualAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-ink/60">
          <span>CGST</span>
          <span>{formatINR(sale.cgst)}</span>
        </div>
        <div className="flex justify-between text-ink/60">
          <span>SGST</span>
          <span>{formatINR(sale.sgst)}</span>
        </div>
      </div>

      <div className="border-t border-line mt-3 pt-3 flex justify-between items-center">
        <span className="font-display font-semibold text-ink">Total</span>
        <span className="font-display font-semibold text-lg text-ink">
          {formatINR(sale.total)}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-dashed border-line flex justify-between text-xs text-ink/50">
        <span>Paid via {sale.paymentMethod}</span>
        {sale.paymentMethod === "Cash" && (
          <span>
            Tendered {formatINR(sale.tendered)} · Change {formatINR(sale.change)}
          </span>
        )}
      </div>
    </div>
  );
}
