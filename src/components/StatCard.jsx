export default function StatCard({ label, value, sub, accent = "ink" }) {
  const accentClass = {
    ink: "text-ink",
    sage: "text-sage",
    ember: "text-ember",
    gold: "text-gold",
  }[accent];

  return (
    <div className="bg-white border border-line rounded-lg p-5">
      <p className="text-xs uppercase tracking-wide text-ink/50 font-medium">
        {label}
      </p>
      <p className={`font-mono text-4xl font-semibold mt-2 ${accentClass}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-ink/45 mt-1.5">{sub}</p>}
    </div>
  );
}
