import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFeedback } from "../context/FeedbackContext";
import TicketCard from "../components/TicketCard";

const STATUS_FILTERS = ["all", "open", "recovered", "closed"];

export default function Inbox() {
  const { feedback, locations } = useFeedback();
  const [searchParams] = useSearchParams();
  const [locationId, setLocationId] = useState(searchParams.get("location") || "all");
  const [sentiment, setSentiment] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return feedback.filter((t) => {
      if (locationId !== "all" && t.locationId !== locationId) return false;
      if (sentiment !== "all" && t.sentiment !== sentiment) return false;
      if (status !== "all" && t.status !== status) return false;
      return true;
    });
  }, [feedback, locationId, sentiment, status]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-sage">
          {filtered.length} ticket{filtered.length === 1 ? "" : "s"}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight mt-1">
          Feedback inbox
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-white border border-line rounded-lg p-3">
        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="text-sm font-mono bg-paper-dim border border-line rounded-md px-3 py-1.5 outline-none"
        >
          <option value="all">All locations</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1 bg-paper-dim border border-line rounded-md p-1">
          {["all", "positive", "neutral", "negative"].map((s) => (
            <button
              key={s}
              onClick={() => setSentiment(s)}
              className={`text-xs font-medium px-2.5 py-1 rounded capitalize transition-colors ${
                sentiment === s ? "bg-ink text-paper" : "text-ink/50 hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-paper-dim border border-line rounded-md p-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`text-xs font-medium px-2.5 py-1 rounded capitalize transition-colors ${
                status === s ? "bg-ink text-paper" : "text-ink/50 hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-ink/50 bg-white border border-line rounded-lg p-10 text-center">
          No tickets match these filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              locationName={locations.find((l) => l.id === t.locationId)?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
