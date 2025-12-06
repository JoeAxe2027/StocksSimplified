import SearchBar from '../components/SearchBar';
import './Home.css';

function Home() {
    return (
        <div className="home">
            <div className="home-content">
                <h1>Welcome to Stocks Simplified</h1>
                <p>Track stocks with clean, simple charts and data</p>
                <SearchBar />

                <div className="popular-stocks">
                    <h3>Popular Stocks</h3>
                    <p>Try: AAPL, TSLA, MSFT, GOOGL, AMZN</p>
                </div>           
            </div>
        </div>
    );
}

export default Home;