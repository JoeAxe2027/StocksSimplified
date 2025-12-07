# StocksSimplified API

Simple Express + MongoDB backend that powers the StocksSimplified frontend.

## Setup
- Copy `.env.example` to `.env` and fill in `MONGO_URI` and `ALPHA_VANTAGE_API_KEY`. Keep `PORT=5001` to match the client default base URL.
- Install deps: `npm install`
- Start dev server: `npm run dev` (uses nodemon) or `npm start`

## Routes
- `GET /api/stocks/watchlist?userId=demo` — list saved stocks for a user.
- `POST /api/stocks/watchlist` — add `{ userId, symbol, companyName, notes? }` (duplicate symbols per user return `409`).
- `DELETE /api/stocks/watchlist/:id` — remove a saved item.
- `GET /api/stocks/data?symbol=AAPL&range=1M` — fetches daily bars from Alpha Vantage and returns summary + `history[]` for charts.

## Notes
- MongoDB connection is set up in `config/db.js`; models live in `models/`.
- The server defaults to port 5001 so it aligns with the client `API_BASE_URL`.
