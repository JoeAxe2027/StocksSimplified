 HEAD
import React from 'react'

export default function Navbar({ current = 'home', onNavigate } = {}) {
  const navigate = (to, e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (typeof onNavigate === 'function') onNavigate(to)
    else if (typeof window !== 'undefined') window.location.href = to === 'home' ? '/' : '/watchlist'
  }

  return (
    <nav className="ls-nav">
      <div className="brand">StocksSimplified</div>
      <div className="nav-links">
        <a
          className={`nav-link ${current === 'home' ? 'active' : ''}`}
          href="/"
          onClick={(e) => navigate('home', e)}
        >
          Home
        </a>
        <a
          className={`nav-link ${current === 'watchlist' ? 'active' : ''}`}
          href="/watchlist"
          onClick={(e) => navigate('watchlist', e)}
        >
          Watchlist
        </a>
      </div>

      <div className="nav-actions">
        <button className="btn">Sign In</button>
      </div>
    </nav>
  )
}

// client/src/components/Navbar.jsx
/*import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header
      style={{
        padding: "1rem 2rem",
        borderBottom: "1px solid #ddd",
        marginBottom: "1rem",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h1 style={{ margin: 0, marginRight: "auto" }}>StocksSimplified</h1>

        <Link to="/">Home</Link>
        <Link to="/watchlist">Watchlist</Link>
      </nav>
    </header>
  );
}
}
*/