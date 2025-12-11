// client/src/components/SearchBar.jsx
import React, { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../services/api";

const LOCAL_FALLBACK = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
];

function SearchBar({ initialSymbol = "AAPL", onSearch }) {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const fetchSuggestions = (q) => {
    if (!q) {
      setSuggestions([]);
      return;
    }

    // Debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      // Try server endpoint first, fall back to LOCAL_FALLBACK
      try {
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();
        const res = await fetch(
          `${API_BASE_URL}/stocks/search?keywords=${encodeURIComponent(q)}`,
          { signal: abortRef.current.signal }
        );

        if (!res.ok) throw new Error("no server suggestions");
        const data = await res.json();

        // Expecting data.matches or an array
        const items = data?.matches || data || [];
        let structured = [];
        if (Array.isArray(items) && items.length > 0) {
          structured = items.map((it) => {
            if (typeof it === "string") {
              const parts = it.split("-");
              return { symbol: (parts[0] || it).trim(), name: (parts[1] || "").trim() };
            }
            return { symbol: (it.symbol || "").toString(), name: (it.name || "").toString() };
          });

          // Prioritize prefix matches then contains, limit results
          const qU = q.toUpperCase();
          const prefix = structured.filter((it) =>
            it.symbol.toUpperCase().startsWith(qU) || it.name.toUpperCase().startsWith(qU)
          );
          const contains = structured.filter(
            (it) =>
              !prefix.includes(it) &&
              (it.symbol.toUpperCase().includes(qU) || it.name.toUpperCase().includes(qU))
          );
          const combined = [...prefix, ...contains].slice(0, 8);
          setSuggestions(combined);
          setOpen(true);
          setActiveIndex(-1);
          return;
        }

        // fallback when provider returns nothing
        const local = LOCAL_FALLBACK.filter((it) =>
          it.symbol.toLowerCase().includes(q.toLowerCase()) || it.name.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 8);
        setSuggestions(local);
        setOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        // network failure or endpoint missing: local fallback
        const local = LOCAL_FALLBACK.filter((it) =>
          it.symbol.toLowerCase().includes(q.toLowerCase()) || it.name.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 8);
        setSuggestions(local);
        setOpen(true);
        setActiveIndex(-1);
      }
    }, 260);
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setSymbol(v);
    if (v.trim()) fetchSuggestions(v.trim());
    else {
      setOpen(false);
      setSuggestions([]);
    }
  };

  const selectSuggestion = (s) => {
    const sym = typeof s === "string" ? s.split("-")[0].trim() : s.symbol;
    setSymbol(sym);
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
    if (onSearch) onSearch(sym);
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();
    const trimmed = symbol.trim().toUpperCase();
    if (!trimmed) return;
    setOpen(false);
    if (onSearch) onSearch(trimmed);
  };

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        selectSuggestion(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // compute suggestions width from input
  const suggestionsStyle = {
    width: inputRef.current ? `${inputRef.current.offsetWidth}px` : "220px",
  };

  return (
    <form onSubmit={handleSubmit} className="search-form" aria-label="Stock search">
      <div className="search-input-group" style={{ position: "relative", display: "flex", gap: "0.5rem" }}>
        <label htmlFor="stock-symbol" style={{ display: "none" }}>
          Stock symbol
        </label>
        <input
          id="stock-symbol"
          ref={inputRef}
          className="search-input"
          type="text"
          placeholder="e.g. AAPL"
          value={symbol}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="Stock symbol"
          aria-autocomplete="list"
          aria-expanded={open}
          style={{
            padding: "0.6rem 0.9rem",
            borderRadius: "0.6rem",
            border: "1px solid #e2e8f0",
            minWidth: 160,
          }}
        />

        <button
          type="submit"
          className="search-btn"
          aria-label="Search stock"
          style={{
            background: "linear-gradient(180deg, #3b82f6, #2563eb)",
            color: "#fff",
            padding: "0.6rem 1rem",
            borderRadius: "0.6rem",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          Search
        </button>

        {open && suggestions && suggestions.length > 0 && (
          <div className="suggestions" role="listbox" style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, ...suggestionsStyle }}>
            {suggestions.map((item, idx) => {
              const display = typeof item === "string" ? item : `${item.symbol} - ${item.name}`;
              return (
                <div
                  key={`${display}-${idx}`}
                  role="option"
                  aria-selected={activeIndex === idx}
                  className={`suggestion-item ${activeIndex === idx ? "active" : ""}`}
                  onMouseDown={(ev) => {
                    // use onMouseDown to prevent blur before click
                    ev.preventDefault();
                    selectSuggestion(item);
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  {display}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </form>
  );
}

export default SearchBar;