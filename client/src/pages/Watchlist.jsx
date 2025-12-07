import React, { useEffect, useState } from 'react'
import '../styles/landing.css'

function readWatchlist() {
  try {
    const raw = localStorage.getItem('stocks_watchlist')
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

function writeWatchlist(list) {
  try {
    localStorage.setItem('stocks_watchlist', JSON.stringify(list))
  } catch (e) {
    // ignore
  }
}

export default function WatchlistPage() {
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(readWatchlist())
  }, [])

  const remove = (ticker) => {
    const updated = items.filter((i) => i.ticker !== ticker)
    setItems(updated)
    writeWatchlist(updated)
  }

  return (
    <div className="landing-root">
      <section className="featured">
        <h2>Your Watchlist</h2>
        {items.length === 0 ? (
          <p className="subtitle">No stocks in your watchlist yet. Add some from Home.</p>
        ) : (
          <div className="stock-table">
            <div className="table-row table-head">
              <div>Name</div>
              <div>Ticker</div>
              <div>Price</div>
              <div>Action</div>
            </div>
            {items.map((s) => (
              <div className="table-row" key={s.ticker}>
                <div className="name">{s.name}</div>
                <div className="ticker">{s.ticker}</div>
                <div className="price">{s.price ? `$${Number(s.price).toFixed(2)}` : '—'}</div>
                <div>
                  <button className="btn" onClick={() => remove(s.ticker)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
