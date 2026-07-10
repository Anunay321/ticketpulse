import { mulberry32, pick, intBetween } from "./seededRandom";

export const CATEGORIES = [
  "Food Quality",
  "Service Speed",
  "Cleanliness",
  "Order Accuracy",
  "Value",
];

export const CHANNELS = ["Dine-in", "Drive-thru", "Pickup", "Delivery"];

export const PLATFORMS = ["Google", "Yelp", "Facebook", "TripAdvisor"];

export const LOCATIONS = [
  { id: "l1", name: "Basil & Ember – Riverside", city: "Portland, OR" },
  { id: "l2", name: "Basil & Ember – Uptown", city: "Denver, CO" },
  { id: "l3", name: "Basil & Ember – Harbor Point", city: "Baltimore, MD" },
  { id: "l4", name: "Basil & Ember – Southgate", city: "Austin, TX" },
  { id: "l5", name: "Basil & Ember – Midtown", city: "Chicago, IL" },
  { id: "l6", name: "Basil & Ember – Lakeview", city: "Madison, WI" },
];

const GUEST_INITIALS = [
  "J.M.", "A.R.", "T.K.", "S.P.", "L.B.", "D.W.", "N.C.", "R.O.",
  "M.H.", "K.F.", "E.G.", "C.S.", "B.T.", "V.L.", "P.N.", "G.D.",
];

const POSITIVE_COMMENTS = [
  "Server remembered our usual order — felt like regulars.",
  "Wood-fired flatbread came out fast and hot, great char on the crust.",
  "Manager stopped by to check in, small touch that mattered.",
  "Patio seating was clean and the pacing of courses was perfect.",
  "Online order was ready early and everything was correctly packed.",
  "New seasonal menu item was a standout, will order again.",
];

const NEUTRAL_COMMENTS = [
  "Food was fine, nothing stood out either way.",
  "A bit noisy at peak hours but service kept up.",
  "Portion sizes felt smaller than last visit.",
  "Had to ask twice for a water refill.",
  "Order took a little longer than expected but was accurate.",
];

const NEGATIVE_COMMENTS = [
  "Order was missing a side and no one caught it at pickup.",
  "Waited over 20 minutes past our reservation with no update.",
  "Flatbread arrived lukewarm, seemed like it sat under a heat lamp.",
  "Table wasn't cleared between the previous guests and us.",
  "Drive-thru got our modification wrong two visits in a row.",
  "Card reader was down and no one mentioned it before we ordered.",
];

const REVIEW_SNIPPET_POS = [
  "become our go-to spot for a weeknight dinner",
  "consistently the best service in the neighborhood",
  "worth the wait, food is always fresh",
];
const REVIEW_SNIPPET_NEG = [
  "kitchen seems overwhelmed on weekends",
  "service has slipped since our last few visits",
  "order accuracy needs work for delivery",
];

function categoryScores(rng, bias) {
  const scores = {};
  CATEGORIES.forEach((c) => {
    // bias shifts the distribution toward low or high scores per-entry
    const base = intBetween(rng, 1, 5);
    const shifted = Math.min(5, Math.max(1, base + bias));
    scores[c] = shifted;
  });
  return scores;
}

function buildFeedback(rng) {
  const entries = [];
  let id = 1;
  const now = new Date("2026-07-10T09:00:00");

  LOCATIONS.forEach((loc, locIdx) => {
    // give each location a slight quality bias so the dashboard has real variance
    const locationBias = [1, 0, -1, 0, 1, -2][locIdx];
    const count = intBetween(rng, 14, 20);

    for (let i = 0; i < count; i++) {
      const daysAgo = intBetween(rng, 0, 29);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);

      const sentimentRoll = rng() + locationBias * 0.08;
      let sentiment, comment, csat;
      if (sentimentRoll > 0.68) {
        sentiment = "positive";
        comment = pick(rng, POSITIVE_COMMENTS);
        csat = intBetween(rng, 4, 5);
      } else if (sentimentRoll > 0.4) {
        sentiment = "neutral";
        comment = pick(rng, NEUTRAL_COMMENTS);
        csat = 3;
      } else {
        sentiment = "negative";
        comment = pick(rng, NEGATIVE_COMMENTS);
        csat = intBetween(rng, 1, 2);
      }

      const bias = sentiment === "positive" ? 1 : sentiment === "negative" ? -1 : 0;

      entries.push({
        id: `t${id++}`,
        locationId: loc.id,
        guest: pick(rng, GUEST_INITIALS),
        channel: pick(rng, CHANNELS),
        date: date.toISOString(),
        csat,
        nps: intBetween(rng, 0, 10),
        categories: categoryScores(rng, bias + locationBias),
        comment,
        sentiment,
        status: sentiment === "negative" ? pick(rng, ["open", "open", "recovered"]) : "closed",
      });
    }
  });

  return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function buildReviews(rng) {
  const reviews = [];
  let id = 1;
  const now = new Date("2026-07-10T09:00:00");

  LOCATIONS.forEach((loc, locIdx) => {
    const count = intBetween(rng, 4, 7);
    const locationBias = [1, 0, -1, 0, 1, -2][locIdx];

    for (let i = 0; i < count; i++) {
      const daysAgo = intBetween(rng, 0, 45);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);

      const roll = rng() + locationBias * 0.1;
      const isPositive = roll > 0.45;
      const rating = isPositive ? intBetween(rng, 4, 5) : intBetween(rng, 1, 3);

      reviews.push({
        id: `r${id++}`,
        locationId: loc.id,
        platform: pick(rng, PLATFORMS),
        author: pick(rng, GUEST_INITIALS),
        date: date.toISOString(),
        rating,
        sentiment: isPositive ? "positive" : "negative",
        text: isPositive
          ? `This place has ${pick(rng, REVIEW_SNIPPET_POS)}.`
          : `Mixed feelings lately — ${pick(rng, REVIEW_SNIPPET_NEG)}.`,
        category: pick(rng, CATEGORIES),
      });
    }
  });

  return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
}

const rng = mulberry32(20260710);
export const FEEDBACK = buildFeedback(rng);
export const REVIEWS = buildReviews(rng);
