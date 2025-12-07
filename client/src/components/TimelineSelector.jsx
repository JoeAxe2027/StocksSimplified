// client/src/components/TimelineSelector.jsx
import React from "react";

const RANGES = ["1D", "1W", "1M", "3M"];

function TimelineSelector({ selectedRange, onChangeRange }) {
  return (
    <div style={{ marginTop: "0.75rem" }}>
      {RANGES.map((range) => (
        <button
          key={range}
          type="button"
          onClick={() => onChangeRange && onChangeRange(range)}
          style={{
            marginRight: "0.5rem",
            fontWeight: selectedRange === range ? "bold" : "normal",
          }}
        >
          {range}
        </button>
      ))}
    </div>
  );
}

export default TimelineSelector;
