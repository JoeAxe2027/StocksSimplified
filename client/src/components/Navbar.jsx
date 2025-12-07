import React from "react";

export default function Navbar({ current = "home", onNavigate } = {}) {
  const navigate = (to, e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (typeof onNavigate === "function") {
      onNavigate(to);
    } else if (typeof window !== "undefined") {
      window.location.href = to === "home" ? "/" : "/watchlist";
    }
  };

  return (
    <nav className="ls-nav">
      <div className="brand">StocksSimplified</div>

      <div className="nav-links">
        <a
          className={`nav-link ${current === "home" ? "active" : ""}`}
          href="/"
          onClick={(e) => navigate("home", e)}
        >
          Home
        </a>

        <a
          className={`nav-link ${current === "watchlist" ? "active" : ""}`}
          href="/watchlist"
          onClick={(e) => navigate("watchlist", e)}
        >
          Watchlist
        </a>
      </div>

      <div className="nav-actions">
        <button className="btn">Sign In</button>
      </div>
    </nav>
  );
}
