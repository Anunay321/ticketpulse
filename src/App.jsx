import { HashRouter, Routes, Route } from "react-router-dom";
import { FeedbackProvider } from "./context/FeedbackContext";
import { PosProvider } from "./context/PosContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import Reviews from "./pages/Reviews";
import Locations from "./pages/Locations";
import Survey from "./pages/Survey";
import Checkout from "./pages/Checkout";
import SalesHistory from "./pages/SalesHistory";

export default function App() {
  return (
    <FeedbackProvider>
      <PosProvider>
        <HashRouter>
          <Routes>
            <Route path="/survey" element={<Survey />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/pos" element={<Checkout />} />
              <Route path="/sales" element={<SalesHistory />} />
            </Route>
          </Routes>
        </HashRouter>
      </PosProvider>
    </FeedbackProvider>
  );
}
