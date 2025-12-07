// client/src/pages/Home.jsx
import { useEffect, useState } from "react";
import { fetchWatchlist } from "../services/watchlistService.js";

function Home() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchWatchlist(); // uses DEFAULT_USER_ID = "demo"
        console.log("Watchlist from API (Home):", data);
        setWatchlist(data);
      } catch (err) {
        console.error("Error loading watchlist on Home page:", err);
      }
    }

    load();
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>StocksSimplified</h1>
      <p>Temporary Home page  we will plug in the real UI later.</p>

      <h2 style={{ marginTop: "1.5rem" }}>Debug watchlist data from MongoDB</h2>
      <pre style={{ background: "#f5f5f5", padding: "1rem" }}>
        {JSON.stringify(watchlist, null, 2)}
      </pre>
    </main>
  );
}

export default Home;
