# StocksSimplified

SearchBar.jsx → handles stock lookup input

TimelineSelector.jsx → date range selector (1D, 1W, 1M…)

StockChart.jsx → displays charts (Chart.js or Recharts)

StockDetails.jsx → shows key stats: high, low, % change

Watchlist.jsx → saved stocks with add/remove buttons

Navbar.jsx → top navigation bar for the app

Optional helpers:

Loader.jsx → spinner while data loads

ErrorMessage.jsx → show API errors

Pages (src/pages/)

Pages are the main views users navigate to:

Home.jsx → default page with search bar, timeline selector, stock chart, stock details

WatchlistPage.jsx → shows saved stocks

StockPage.jsx → dynamic page for a specific stock (optional depending on design)

Services (src/services/)

These handle API requests to your backend:

api.js → Axios instance

stockService.js → functions like getStockData(ticker), getHistoricalData(ticker, range)

watchlistService.js → getWatchlist(userId), addStock(userId, ticker), removeStock(userId, ticker)

Assets (src/assets/)


Images, icons, logos, chart background images



Frontend (React) - Evan, Connor
Backend (Node/Express) - Joey
Database (MongoDB) - Cole Taddei
Presentation/Documentation - Everyone
https://youtu.be/m9dRkPLn21c
