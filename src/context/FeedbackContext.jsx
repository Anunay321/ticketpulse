import { createContext, useContext, useMemo, useState } from "react";
import { LOCATIONS, FEEDBACK, REVIEWS, CATEGORIES } from "../data/mockData";

const FeedbackContext = createContext(null);

export function FeedbackProvider({ children }) {
  const [feedback, setFeedback] = useState(FEEDBACK);
  const [reviews] = useState(REVIEWS);
  const [justSubmittedId, setJustSubmittedId] = useState(null);

  function submitFeedback(entry) {
    const id = `t${Date.now()}`;
    const newEntry = {
      id,
      date: new Date().toISOString(),
      status: entry.sentiment === "negative" ? "open" : "closed",
      ...entry,
    };
    setFeedback((prev) => [newEntry, ...prev]);
    setJustSubmittedId(id);
    return id;
  }

  function resolveTicket(id) {
    setFeedback((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "recovered" } : t))
    );
  }

  const value = useMemo(
    () => ({
      locations: LOCATIONS,
      feedback,
      reviews,
      categories: CATEGORIES,
      submitFeedback,
      resolveTicket,
      justSubmittedId,
    }),
    [feedback, reviews, justSubmittedId]
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider");
  return ctx;
}
