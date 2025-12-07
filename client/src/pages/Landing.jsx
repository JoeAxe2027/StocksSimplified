import React, { useState, useEffect } from 'react'
import '../styles/landing.css'

const sampleStocks = [
  { name: 'Apple Inc.', ticker: 'AAPL', price: 178.45, change: 1.24 },
  { name: 'Microsoft Corp.', ticker: 'MSFT', price: 349.12, change: -0.87 },
  { name: 'Tesla, Inc.', ticker: 'TSLA', price: 252.33, change: 3.12 },
  { name: 'Alphabet Inc.', ticker: 'GOOGL', price: 131.75, change: -2.01 },
]

export default function Landing() {
  const [query, setQuery] = useState('')
  const [watchlist, setWatchlist] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('stocks_watchlist')
      setWatchlist(raw ? JSON.parse(raw) : [])
    } catch (e) {
      setWatchlist([])
    }
  }, [])

  const filtered = sampleStocks.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.ticker.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="landing-root">
      
      <header className="hero">
        <h1>Stock prices, simplified.</h1>
        <p className="subtitle">Quickly view prices, tickers, and basic info at a glance.</p>
        <div className="search-row">
          <input
            aria-label="Search stocks"
            placeholder="Search by name or ticker (e.g. AAPL)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <section className="featured">
        <h2>Featured Stocks</h2>
        <div className="stock-table">
          <div className="table-row table-head">
            <div>Name</div>
            <div>Ticker</div>
            <div>Price</div>
            <div>Change</div>
          </div>
          {filtered.map((s) => {
            const isWatching = watchlist.some((w) => w.ticker === s.ticker)
            const toggle = () => {
              try {
                const raw = localStorage.getItem('stocks_watchlist')
                const list = raw ? JSON.parse(raw) : []
                let updated
                if (isWatching) {
                  updated = list.filter((w) => w.ticker !== s.ticker)
                } else {
                  updated = [...list, { name: s.name, ticker: s.ticker, price: s.price }]
                }
                localStorage.setItem('stocks_watchlist', JSON.stringify(updated))
                setWatchlist(updated)
              } catch (e) {
                // ignore
              }
            }

            return (
              <div className="table-row" key={s.ticker}>
                <div className="name">{s.name}</div>
                <div className="ticker">{s.ticker}</div>
                <div className="price">${s.price.toFixed(2)}</div>
                <div className={`change ${s.change >= 0 ? 'up' : 'down'}`}>
                  {s.change >= 0 ? '▲' : '▼'} {Math.abs(s.change).toFixed(2)}%
                </div>
                <div>
                  <button className="btn" onClick={toggle} style={{marginLeft:12}}>
                    {isWatching ? 'Remove' : 'Add'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <footer className="ls-footer">© {new Date().getFullYear()} StocksSimplified</footer>
    </div>
  )
}
