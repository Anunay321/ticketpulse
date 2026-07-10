# TicketPulse

A guest CSAT / feedback-platform prototype for a fictional restaurant group
("Basil & Ember"), built to demonstrate the feature set of tools like
**piHappiness** and **Tattle**: post-visit surveys, a feedback inbox with
recovery workflow, online review aggregation, and location-level analytics.

This is an original build — no code, assets, or copy from any existing
product. It's a working prototype with deterministic sample data, not a
production system.

## Features

- **Guest survey** (`/survey`) — a 3-step post-visit form: location + order
  channel, an emoticon CSAT scale, per-category ratings (food quality,
  service speed, cleanliness, order accuracy, value), and an optional
  comment. Submitting creates a new ticket that immediately appears in the
  operator views.
- **Dashboard** (`/`) — CSAT (top-box %) and NPS roll-ups, a 14-day CSAT
  trend, sentiment split, category averages, and an "Opportunity Rank" panel
  that flags the lowest-scoring category as the highest-leverage place to
  focus improvement.
- **Feedback inbox** (`/inbox`) — every guest ticket as a ticket-stub card,
  filterable by location, sentiment, and status, with a one-click
  "mark recovered" action for open (negative) tickets.
- **Online reviews** (`/reviews`) — mock aggregated reviews across Google,
  Yelp, Facebook, and TripAdvisor, with per-platform rating summaries and
  sentiment/category tagging.
- **Locations** (`/locations`) — a comparison table ranking all 6 locations
  by CSAT, NPS, review average, and top opportunity.

## Tech stack

React 19 + Vite, React Router, Tailwind CSS v4, Recharts, lucide-react.
All data is generated client-side from a seeded random generator
(`src/data/mockData.js`) — there's no backend or database.

## Running locally

```bash
npm install
npm run dev       # dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Project structure

```
src/
  components/   Layout, StatCard, TicketCard (shared UI)
  context/      FeedbackContext — in-memory store + submit/resolve actions
  data/         mockData (sample dataset), analytics (CSAT/NPS/trend math)
  pages/        Dashboard, Inbox, Reviews, Locations, Survey
```

## Notes / next steps for a real build

- Swap `FeedbackContext`'s in-memory state for a real API + database.
- Add auth so each location manager only sees their own data.
- Wire the review aggregation to real platform APIs (Google Business
  Profile, Yelp Fusion, etc.) instead of mock data.
- Add SMS/email survey dispatch (e.g. via Twilio/SendGrid) after a POS
  transaction, matching how Tattle triggers its post-visit surveys.
