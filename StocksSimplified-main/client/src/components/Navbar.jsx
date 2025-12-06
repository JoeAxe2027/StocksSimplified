import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{padding: '1rem', background: '#333', color: 'white'}}>
        <Link to="/" style={{color: 'white', marginRight: '1rem'}}>StocksSimplified</Link>
        <Link to="/" style={{color: 'white', marginRight: '1rem'}}>Home</Link>
        <Link to="/watchlist" style={{color: 'white'}}>Watchlist</Link>
    </nav>
    );
}

export default Navbar;