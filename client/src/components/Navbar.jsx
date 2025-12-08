import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    // initialize theme: localStorage -> system preference -> light
    let t = theme;
    if (!t) {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      t = prefersDark ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("theme", t);
    } catch (e) {}
    setTheme(t);
  }, []); // run once

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          StocksSimplified
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/watchlist"
            className={`nav-link ${location.pathname === "/watchlist" ? "active" : ""}`}
          >
            Watchlist
          </Link>
        </div>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="icon" aria-hidden>
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
          </button>
          <button className="sign-in-btn">Sign In(TBD)</button>
        </div>
      </div>
    </nav>
  );
}
