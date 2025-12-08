// client/src/components/TimelineSelector.jsx
import React from "react";

const RANGES = ["1D", "1W", "1M", "3M"];

function TimelineSelector({ selectedRange, onChangeRange }) {
  return (
    <div className="timeline-selector">
      {RANGES.map((range) => (
        <button
          key={range}
          type="button"
          className={`timeline-btn ${selectedRange === range ? "active" : ""}`}
          onClick={() => onChangeRange && onChangeRange(range)}
        >
          {range}
        </button>
      ))}
    </div>
  );
}

export default TimelineSelector;