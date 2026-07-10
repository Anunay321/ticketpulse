import { useNavigate } from "react-router-dom";
import { useFeedback } from "../context/FeedbackContext";
import { csatScore, npsScore, topOpportunity } from "../data/analytics";

export default function Locations() {
  const { locations, feedback, reviews, categories } = useFeedback();
  const navigate = useNavigate();

  const rows = locations
    .map((loc) => {
      const locFeedback = feedback.filter((f) => f.locationId === loc.id);
      const locReviews = reviews.filter((r) => r.locationId === loc.id);
      const avgReview = locReviews.length
        ? (locReviews.reduce((a, r) => a + r.rating, 0) / locReviews.length).toFixed(1)
        : "–";
      const opportunity = locFeedback.length
        ? topOpportunity(locFeedback, categories)
        : null;
      const openCount = locFeedback.filter((f) => f.status === "open").length;

      return {
        loc,
        csat: csatScore(locFeedback),
        nps: npsScore(locFeedback),
        avgReview,
        opportunity,
        openCount,
        responseCount: locFeedback.length,
      };
    })
    .sort((a, b) => b.csat - a.csat);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-sage">
          {locations.length} locations
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight mt-1">
          Location comparison
        </h1>
      </div>

      <div className="bg-white border border-line rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-paper-dim text-left">
              <th className="px-5 py-3 font-medium text-ink/50 text-xs uppercase tracking-wide">
                Location
              </th>
              <th className="px-4 py-3 font-medium text-ink/50 text-xs uppercase tracking-wide font-mono">
                CSAT
              </th>
              <th className="px-4 py-3 font-medium text-ink/50 text-xs uppercase tracking-wide font-mono">
                NPS
              </th>
              <th className="px-4 py-3 font-medium text-ink/50 text-xs uppercase tracking-wide font-mono">
                Review avg
              </th>
              <th className="px-4 py-3 font-medium text-ink/50 text-xs uppercase tracking-wide">
                Top opportunity
              </th>
              <th className="px-5 py-3 font-medium text-ink/50 text-xs uppercase tracking-wide text-right">
                Open
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ loc, csat, nps, avgReview, opportunity, openCount, responseCount }) => (
              <tr
                key={loc.id}
                onClick={() => navigate(`/inbox?location=${loc.id}`)}
                className="border-b border-line last:border-0 hover:bg-paper-dim/60 transition-colors cursor-pointer"
              >
                <td className="px-5 py-4">
                  <p className="font-medium">{loc.name}</p>
                  <p className="text-xs text-ink/45">
                    {loc.city} · {responseCount} responses
                  </p>
                </td>
                <td className="px-4 py-4 font-mono">
                  <span className={csat >= 70 ? "text-sage" : csat >= 50 ? "text-gold" : "text-ember"}>
                    {csat}%
                  </span>
                </td>
                <td className="px-4 py-4 font-mono text-ink/70">{nps}</td>
                <td className="px-4 py-4 font-mono text-ink/70">{avgReview}</td>
                <td className="px-4 py-4 text-ink/70">{opportunity?.category ?? "–"}</td>
                <td className="px-5 py-4 text-right">
                  {openCount > 0 ? (
                    <span className="font-mono text-xs bg-ember-soft text-ember px-2 py-1 rounded">
                      {openCount}
                    </span>
                  ) : (
                    <span className="text-ink/30 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
