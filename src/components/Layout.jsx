import { NavLink, Outlet } from "react-router-dom";
import { LayoutGrid, Inbox, Star, MapPin, Send, Bell } from "lucide-react";
import { useFeedback } from "../context/FeedbackContext";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/inbox", label: "Feedback Inbox", icon: Inbox },
  { to: "/reviews", label: "Online Reviews", icon: Star },
  { to: "/locations", label: "Locations", icon: MapPin },
];

export default function Layout() {
  const { feedback } = useFeedback();
  const openCount = feedback.filter((f) => f.status === "open").length;

  return (
    <div className="min-h-screen flex bg-paper text-ink font-body">
      <aside className="w-64 shrink-0 bg-ink text-paper flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-gold flex items-center justify-center font-display font-bold text-ink text-sm">
              BE
            </div>
            <div>
              <p className="font-display font-semibold tracking-tight leading-none">
                TicketPulse
              </p>
              <p className="text-[11px] text-paper/50 font-mono mt-0.5">
                Basil &amp; Ember · Guest CX
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-paper"
                    : "text-paper/60 hover:text-paper hover:bg-white/5"
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon size={17} strokeWidth={2} />
                {label}
              </span>
              {label === "Feedback Inbox" && openCount > 0 && (
                <span className="text-[11px] font-mono bg-ember text-paper rounded-full px-1.5 py-0.5 leading-none">
                  {openCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3">
          <NavLink
            to="/survey"
            className="flex items-center gap-2 justify-center px-3 py-2.5 rounded-md text-sm font-semibold bg-sage text-paper hover:bg-sage/90 transition-colors"
          >
            <Send size={15} />
            Open Guest Survey
          </NavLink>
          <p className="text-[11px] text-paper/40 font-mono mt-2 px-1 leading-snug">
            Demo link a guest would tap after a visit.
          </p>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="border-b border-line bg-paper/95 backdrop-blur px-8 py-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-2 text-sm text-ink/60">
            <Bell size={16} />
            <span className="font-mono">{openCount} open incident{openCount === 1 ? "" : "s"}</span>
          </div>
        </header>
        <main className="flex-1 px-8 py-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
