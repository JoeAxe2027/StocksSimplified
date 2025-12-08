import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const location = useLocation();

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
          <button className="sign-in-btn">Sign In(TBD)</button>
        </div>
      </div>
    </nav>
  );
}
