// client/src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import WatchlistPage from "./pages/WatchlistPage.jsx";
import { fetchWatchlist } from "./services/watchlistService.js";
import "./styles/global.css";

function App() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchWatchlist();
        console.log("Watchlist from API:", data);
        setWatchlist(data);
      } catch (err) {
        console.error("Error loading watchlist in App:", err);
      }
    }

    load();
  }, []);

  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/"
            element={<Home initialWatchlist={watchlist} />}
          />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
