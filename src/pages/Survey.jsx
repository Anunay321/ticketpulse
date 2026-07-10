import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Frown, Meh, Smile, SmilePlus, Angry, ArrowLeft } from "lucide-react";
import { useFeedback } from "../context/FeedbackContext";
import { CHANNELS } from "../data/mockData";

const FACES = [
  { value: 1, Icon: Angry, label: "Terrible" },
  { value: 2, Icon: Frown, label: "Not great" },
  { value: 3, Icon: Meh, label: "Okay" },
  { value: 4, Icon: Smile, label: "Good" },
  { value: 5, Icon: SmilePlus, label: "Excellent" },
];

function sentimentFromCsat(csat) {
  if (csat >= 4) return "positive";
  if (csat === 3) return "neutral";
  return "negative";
}

export default function Survey() {
  const { locations, categories, submitFeedback } = useFeedback();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [locationId, setLocationId] = useState(locations[0].id);
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [csat, setCsat] = useState(null);
  const [catScores, setCatScores] = useState(
    Object.fromEntries(categories.map((c) => [c, 3]))
  );
  const [comment, setComment] = useState("");
  const [submittedId, setSubmittedId] = useState(null);

  function handleSubmit() {
    const id = submitFeedback({
      locationId,
      channel,
      guest: "You",
      csat,
      nps: csat === 5 ? 10 : csat === 4 ? 8 : csat === 3 ? 6 : csat === 2 ? 3 : 1,
      categories: catScores,
      comment: comment.trim() || "No written comment provided.",
      sentiment: sentimentFromCsat(csat),
    });
    setSubmittedId(id);
    setStep(3);
  }

  return (
    <div className="min-h-screen bg-paper-dim flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs text-ink/50 hover:text-ink mb-4 font-medium"
        >
          <ArrowLeft size={14} />
          Back to dashboard (operator view)
        </button>

        <div className="bg-white border border-line rounded-xl p-6 ticket-tear">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-sm bg-gold flex items-center justify-center font-display font-bold text-ink text-[10px]">
              BE
            </div>
            <p className="text-xs font-mono text-ink/45 uppercase tracking-widest">
              Basil &amp; Ember · How was your visit?
            </p>
          </div>

          {step === 0 && (
            <div className="mt-5 space-y-5">
              <div>
                <label className="text-xs font-medium text-ink/60 uppercase tracking-wide">
                  Which location?
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full mt-1.5 text-sm bg-paper-dim border border-line rounded-md px-3 py-2 outline-none"
                >
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-ink/60 uppercase tracking-wide">
                  How did you order?
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {CHANNELS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setChannel(c)}
                      className={`text-sm py-2 rounded-md border transition-colors ${
                        channel === c
                          ? "bg-ink text-paper border-ink"
                          : "border-line text-ink/60 hover:border-ink/40"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="w-full bg-sage text-paper text-sm font-semibold rounded-md py-2.5 hover:bg-sage/90 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="mt-5 space-y-5">
              <p className="text-sm font-medium text-ink">
                Overall, how was your experience?
              </p>
              <div className="flex justify-between">
                {FACES.map(({ value, Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setCsat(value)}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <span
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        csat === value
                          ? "bg-gold border-gold text-ink"
                          : "border-line text-ink/40 group-hover:border-gold/50"
                      }`}
                    >
                      <Icon size={22} />
                    </span>
                    <span className="text-[10px] text-ink/45">{label}</span>
                  </button>
                ))}
              </div>
              <button
                disabled={!csat}
                onClick={() => setStep(2)}
                className="w-full bg-sage text-paper text-sm font-semibold rounded-md py-2.5 hover:bg-sage/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="mt-5 space-y-5">
              <p className="text-sm font-medium text-ink">Rate a few specifics</p>
              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-ink/60">{cat}</span>
                      <span className="text-xs font-mono text-ink/50">
                        {catScores[cat]}/5
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={catScores[cat]}
                      onChange={(e) =>
                        setCatScores((prev) => ({ ...prev, [cat]: Number(e.target.value) }))
                      }
                      className="w-full accent-sage"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-medium text-ink/60 uppercase tracking-wide">
                  Anything you'd like to add? (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Tell us what stood out..."
                  className="w-full mt-1.5 text-sm bg-paper-dim border border-line rounded-md px-3 py-2 outline-none resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-ink text-paper text-sm font-semibold rounded-md py-2.5 hover:bg-ink/90 transition-colors"
              >
                Submit feedback
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="mt-6 text-center py-6">
              <p className="font-display text-xl font-semibold">Thanks for the feedback</p>
              <p className="text-sm text-ink/55 mt-2 leading-relaxed">
                Ticket <span className="font-mono text-ink">#{submittedId}</span> was just
                created{sentimentFromCsat(csat) === "negative" ? " and flagged for recovery" : ""}.
              </p>
              <button
                onClick={() => navigate("/inbox")}
                className="mt-5 text-sm font-semibold text-sage hover:underline"
              >
                View it in the operator inbox →
              </button>
            </div>
          )}
        </div>

        {step < 3 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === step ? "w-6 bg-sage" : "w-1.5 bg-line"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
