import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function StockChart({ history }) {
  if (!history || history.length === 0) {
    return <p>No chart data available.</p>;
  }

  return (
    <div style={{ width: "100%", height: 400, marginTop: "2rem" }}>
      <ResponsiveContainer>
        <LineChart data={history}>
          <XAxis dataKey="date" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#007bff"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
