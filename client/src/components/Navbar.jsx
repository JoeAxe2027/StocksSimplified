// client/src/components/Navbar.jsx
import { Link } from "react-router-dom";

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
