export function average(nums) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// CSAT here = % of responses rating 4 or 5 (the standard "top box" definition).
export function csatScore(entries) {
  if (!entries.length) return 0;
  const topBox = entries.filter((e) => e.csat >= 4).length;
  return Math.round((topBox / entries.length) * 100);
}

// Net Promoter Score = % promoters (9-10) minus % detractors (0-6).
export function npsScore(entries) {
  if (!entries.length) return 0;
  const promoters = entries.filter((e) => e.nps >= 9).length;
  const detractors = entries.filter((e) => e.nps <= 6).length;
  return Math.round(((promoters - detractors) / entries.length) * 100);
}

export function categoryAverages(entries, categories) {
  return categories.map((cat) => ({
    category: cat,
    average: Number(average(entries.map((e) => e.categories[cat])).toFixed(2)),
  }));
}

// "Opportunity Rank": the category with the lowest average score is the
// highest-leverage place to focus improvement effort — mirrors how
// feedback platforms like Tattle surface a single priority per location.
export function topOpportunity(entries, categories) {
  const avgs = categoryAverages(entries, categories);
  return avgs.reduce((worst, cur) => (cur.average < worst.average ? cur : worst), avgs[0]);
}

export function trendByDay(entries, days = 14) {
  const now = new Date("2026-07-10T09:00:00");
  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.push({ date: key, entries: [] });
  }
  entries.forEach((e) => {
    const key = e.date.slice(0, 10);
    const bucket = buckets.find((b) => b.date === key);
    if (bucket) bucket.entries.push(e);
  });
  return buckets.map((b) => ({
    date: b.date.slice(5),
    csat: b.entries.length ? csatScore(b.entries) : null,
    volume: b.entries.length,
  }));
}

export function sentimentBreakdown(entries) {
  const positive = entries.filter((e) => e.sentiment === "positive").length;
  const neutral = entries.filter((e) => e.sentiment === "neutral").length;
  const negative = entries.filter((e) => e.sentiment === "negative").length;
  return [
    { name: "Positive", value: positive },
    { name: "Neutral", value: neutral },
    { name: "Negative", value: negative },
  ];
}
