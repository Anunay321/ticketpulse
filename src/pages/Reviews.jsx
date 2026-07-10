import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { useFeedback } from "../context/FeedbackContext";
import { PLATFORMS } from "../data/mockData";

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? "fill-gold text-gold" : "text-line"}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const { reviews, locations } = useFeedback();
  const [platform, setPlatform] = useState("all");
  const [locationId, setLocationId] = useState("all");

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (platform !== "all" && r.platform !== platform) return false;
      if (locationId !== "all" && r.locationId !== locationId) return false;
      return true;
    });
  }, [reviews, platform, locationId]);

  const platformSummary = PLATFORMS.map((p) => {
    const list = reviews.filter((r) => r.platform === p);
    const avg = list.length
      ? (list.reduce((a, r) => a + r.rating, 0) / list.length).toFixed(1)
      : "–";
    return { platform: p, count: list.length, avg };
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-sage">
          {filtered.length} review{filtered.length === 1 ? "" : "s"}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight mt-1">
          Online reviews
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {platformSummary.map((p) => (
          <button
            key={p.platform}
            onClick={() => setPlatform(platform === p.platform ? "all" : p.platform)}
            className={`text-left bg-white border rounded-lg p-4 transition-colors ${
              platform === p.platform ? "border-sage ring-1 ring-sage" : "border-line"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-ink/50 font-medium">
              {p.platform}
            </p>
            <p className="font-mono text-2xl font-semibold mt-1">{p.avg}</p>
            <p className="text-xs text-ink/45 mt-0.5">{p.count} reviews</p>
          </button>
        ))}
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
        {platform !== "all" && (
          <button
            onClick={() => setPlatform("all")}
            className="text-xs font-medium text-ink/50 hover:text-ink underline"
          >
            Clear platform filter ({platform})
          </button>
        )}
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white border border-line rounded-md p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold">{r.author}</span>
                  <span className="text-xs text-ink/40 font-mono">
                    · {r.platform} · {fmtDate(r.date)}
                  </span>
                </div>
                <div className="mt-1.5">
                  <StarRow rating={r.rating} />
                </div>
                <p className="text-sm text-ink/80 mt-2 leading-snug max-w-2xl">{r.text}</p>
              </div>
              <span
                className={`text-[11px] font-mono px-2 py-1 rounded shrink-0 ${
                  r.sentiment === "positive"
                    ? "bg-sage-soft text-sage"
                    : "bg-ember-soft text-ember"
                }`}
              >
                {r.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
