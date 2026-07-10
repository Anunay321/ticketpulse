import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FeedbackProvider } from "./context/FeedbackContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import Reviews from "./pages/Reviews";
import Locations from "./pages/Locations";
import Survey from "./pages/Survey";

export default function App() {
  return (
    <FeedbackProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/survey" element={<Survey />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/locations" element={<Locations />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FeedbackProvider>
  );
}
