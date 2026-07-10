import { Circle, CheckCircle2, AlertCircle } from "lucide-react";
import { useFeedback } from "../context/FeedbackContext";

const SENTIMENT_STYLE = {
  positive: { dot: "bg-sage", label: "text-sage" },
  neutral: { dot: "bg-gold", label: "text-gold" },
  negative: { dot: "bg-ember", label: "text-ember" },
};

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }) +
    " " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function TicketCard({ ticket, locationName }) {
  const { resolveTicket } = useFeedback();
  const style = SENTIMENT_STYLE[ticket.sentiment];

  return (
    <div className="ticket-tear bg-white border border-line rounded-md pt-4 pb-4 px-5 relative">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
            <span className="font-mono text-xs text-ink/50">
              #{ticket.id} · {fmtDate(ticket.date)}
            </span>
            <span className="font-mono text-xs text-ink/40">·</span>
            <span className="font-mono text-xs text-ink/50">{ticket.channel}</span>
            {locationName && (
              <>
                <span className="font-mono text-xs text-ink/40">·</span>
                <span className="font-mono text-xs text-ink/50">{locationName}</span>
              </>
            )}
          </div>
          <p className="text-sm text-ink mt-2 leading-snug">{ticket.comment}</p>
        </div>

        <div className="text-right shrink-0">
          <p className="font-mono text-2xl font-semibold leading-none">
            {ticket.csat}
            <span className="text-ink/30 text-sm">/5</span>
          </p>
          <p className="text-[11px] text-ink/40 mt-1">Guest {ticket.guest}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-line/70">
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(ticket.categories).map(([cat, score]) => (
            <span
              key={cat}
              className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${
                score <= 2
                  ? "border-ember/30 text-ember bg-ember-soft"
                  : "border-line text-ink/50 bg-paper-dim"
              }`}
              title={cat}
            >
              {cat.split(" ")[0]} {score}
            </span>
          ))}
        </div>

        {ticket.status === "open" && (
          <button
            onClick={() => resolveTicket(ticket.id)}
            className="flex items-center gap-1.5 text-xs font-medium text-ember hover:text-ember/80 transition-colors shrink-0"
          >
            <AlertCircle size={14} />
            Mark recovered
          </button>
        )}
        {ticket.status === "recovered" && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-sage shrink-0">
            <CheckCircle2 size={14} />
            Recovered
          </span>
        )}
        {ticket.status === "closed" && (
          <span className="flex items-center gap-1.5 text-xs text-ink/35 shrink-0">
            <Circle size={12} />
            No action needed
          </span>
        )}
      </div>
    </div>
  );
}
