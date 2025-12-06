import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

function SearchBar() {
    const [ticker, setTicker] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (ticker.trim()) {
            navigate(`/stock/${ticker.toUpperCase()}`);
            setTicker('');
        }
    };
    return (
        <form onSubmit={handleSearch} className="search-bar">
            <input
                type="text"
                placeholder="Enter stock ticker (e.g., AAPL)"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
        </form>
    );
}
export default SearchBar;