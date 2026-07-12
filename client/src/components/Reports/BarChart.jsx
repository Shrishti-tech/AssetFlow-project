import { colorForIndex } from "./colors";

export default function BarChart({ data = [], max, valueSuffix = "", colorMode = "categorical" }) {
  const maxValue = max ?? Math.max(1, ...data.map((item) => item.value));

  if (!data.length) {
    return <p className="booking-empty">No data available.</p>;
  }

  return (
    <div className="report-bar-chart">
      {data.map((item, index) => {
        const width = Math.min(100, (item.value / maxValue) * 100);
        const color = colorMode === "single" ? "#087ea4" : colorForIndex(index);
        return (
          <div className="report-bar-row" key={item.label}>
            <span title={item.label}>{item.label}</span>
            <div className="report-bar-track">
              <div className="report-bar-fill" style={{ width: `${width}%`, background: color }} />
            </div>
            <b>
              {item.value}
              {valueSuffix}
            </b>
          </div>
        );
      })}
    </div>
  );
}
