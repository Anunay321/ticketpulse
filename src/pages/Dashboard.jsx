import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { useFeedback } from "../context/FeedbackContext";
import {
  csatScore,
  npsScore,
  categoryAverages,
  trendByDay,
  sentimentBreakdown,
  topOpportunity,
} from "../data/analytics";
import StatCard from "../components/StatCard";
import TicketCard from "../components/TicketCard";
import { AlertTriangle } from "lucide-react";

const SENTIMENT_COLORS = ["#3e6259", "#c89b3c", "#c1440e"];

export default function Dashboard() {
  const { feedback, categories, locations } = useFeedback();

  const csat = csatScore(feedback);
  const nps = npsScore(feedback);
  const cats = categoryAverages(feedback, categories);
  const trend = trendByDay(feedback);
  const sentiment = sentimentBreakdown(feedback);
  const openTickets = feedback.filter((f) => f.status === "open").slice(0, 4);
  const overallOpportunity = topOpportunity(feedback, categories);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-sage">
          Last 30 days · All locations
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight mt-1">
          Guest pulse overview
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="CSAT (top box)" value={`${csat}%`} sub="Rated 4–5 of 5" accent="sage" />
        <StatCard label="Net Promoter Score" value={nps} sub="Promoters − detractors" accent="gold" />
        <StatCard label="Responses collected" value={feedback.length} sub="Across 6 locations" />
        <StatCard
          label="Open incidents"
          value={feedback.filter((f) => f.status === "open").length}
          sub="Awaiting recovery"
          accent="ember"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-line rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-ink">CSAT trend, 14-day view</h2>
          </div>
          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 6, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#ddd4c2" strokeDasharray="3 5" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fontFamily: "IBM Plex Mono", fill: "#1f1b16aa" }}
                  axisLine={{ stroke: "#ddd4c2" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fontFamily: "IBM Plex Mono", fill: "#1f1b16aa" }}
                  axisLine={false}
                  tickLine={false}
                  width={34}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: "IBM Plex Mono",
                    fontSize: 12,
                    border: "1px solid #ddd4c2",
                    borderRadius: 6,
                  }}
                  formatter={(v, name) => (name === "csat" ? [`${v}%`, "CSAT"] : [v, "Responses"])}
                />
                <Line
                  type="monotone"
                  dataKey="csat"
                  stroke="#3e6259"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: "#3e6259" }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-line rounded-lg p-6">
          <h2 className="font-display font-semibold text-ink">Sentiment split</h2>
          <div className="h-40 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentiment}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={42}
                  outerRadius={65}
                  paddingAngle={2}
                >
                  {sentiment.map((_, i) => (
                    <Cell key={i} fill={SENTIMENT_COLORS[i]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: "IBM Plex Mono", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-1">
            {sentiment.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-ink/60">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: SENTIMENT_COLORS[i] }}
                  />
                  {s.name}
                </span>
                <span className="font-mono text-ink/70">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-line rounded-lg p-6">
          <h2 className="font-display font-semibold text-ink">Category averages</h2>
          <p className="text-xs text-ink/45 mt-1">Out of 5, all locations blended</p>
          <div className="h-52 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cats} margin={{ top: 6, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#ddd4c2" strokeDasharray="3 5" vertical={false} />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fontFamily: "IBM Plex Mono", fill: "#1f1b16aa" }}
                  axisLine={{ stroke: "#ddd4c2" }}
                  tickLine={false}
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  domain={[0, 5]}
                  tick={{ fontSize: 11, fontFamily: "IBM Plex Mono", fill: "#1f1b16aa" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip contentStyle={{ fontFamily: "IBM Plex Mono", fontSize: 12 }} />
                <Bar dataKey="average" radius={[3, 3, 0, 0]}>
                  {cats.map((c, i) => (
                    <Cell
                      key={i}
                      fill={c.category === overallOpportunity.category ? "#c1440e" : "#3e6259"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-ink text-paper rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-gold">
              <AlertTriangle size={16} />
              <p className="text-xs font-mono uppercase tracking-widest">Opportunity Rank</p>
            </div>
            <p className="font-display text-xl font-semibold mt-3 leading-snug">
              {overallOpportunity.category}
            </p>
            <p className="text-sm text-paper/60 mt-2 leading-relaxed">
              The lowest-scoring category across all locations right now, averaging{" "}
              <span className="font-mono text-paper">{overallOpportunity.average}/5</span>.
              Improving this has the largest projected lift on overall CSAT.
            </p>
          </div>
          <p className="text-[11px] font-mono text-paper/40 mt-6">
            Recalculated nightly from the last 30 days of tickets
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-ink">Needs attention</h2>
          <Link to="/inbox" className="text-xs font-medium text-sage hover:underline">
            View full inbox →
          </Link>
        </div>
        {openTickets.length === 0 ? (
          <p className="text-sm text-ink/50 bg-white border border-line rounded-lg p-6 text-center">
            No open incidents — every negative ticket has been recovered.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openTickets.map((t) => (
              <TicketCard
                key={t.id}
                ticket={t}
                locationName={locations.find((l) => l.id === t.locationId)?.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
