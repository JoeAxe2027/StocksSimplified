 HEAD
import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import WatchlistPage from './pages/Watchlist'

function App() {
  const [route, setRoute] = useState('home')

  return (
    <div>
      <Navbar current={route} onNavigate={(to) => setRoute(to)} />
      {route === 'home' && <Landing />}
      {route === 'watchlist' && <WatchlistPage />}
    </div>
  )
}

/*// client/src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Navbar } from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import WatchlistPage from "./pages/WatchlistPage.jsx";
import { fetchWatchlist } from "./services/watchlistService.js";

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
      <main style={{ padding: "2rem" }}>
        <Routes>
          <Route
            path="/"
            element={<Home initialWatchlist={watchlist} />}
          />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Routes>
      </main>
    </Router>
  );

}
}
export default App;
*/