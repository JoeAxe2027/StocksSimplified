import React from "react";
import "../styles/footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>StocksSimplified</h3>
            <p>Your go-to platform for simplified stock analysis and watchlist management.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/watchlist">Watchlist</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Data Source</h4>
            <p>Stock data powered by <a href="https://www.alphavantage.co/" target="_blank" rel="noopener noreferrer">Alpha Vantage</a></p>
          </div>
        </div>

        <div className="footer-bottom">
          <p> {currentYear} StocksSimplified.</p>
        </div>
      </div>
    </footer>
  );
}
