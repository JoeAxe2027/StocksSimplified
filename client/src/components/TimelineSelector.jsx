// client/src/components/TimelineSelector.jsx
import React from "react";

const RANGES = ["1D", "1W", "1M", "3M", "6M"];

function TimelineSelector({ selectedRange, onChangeRange }) {
  return (
    <div className="timeline-selector" style={{ marginTop: "0.75rem" }}>
      {RANGES.map((range) => (
        <button
          key={range}
          type="button"
          onClick={() => onChangeRange && onChangeRange(range)}
          className={`timeline-btn ${selectedRange === range ? "active" : ""}`}
          aria-pressed={selectedRange === range}
        >
          {range}
        </button>
      ))}
    </div>
  );
}

export default TimelineSelector;