import { sequentialStep } from "./colors";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DEFAULT_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];

export default function Heatmap({ cells = [], days = DAY_ORDER, hours }) {
  const hourRange = hours || (cells.length ? [...new Set(cells.map((cell) => cell.hour))].sort((a, b) => a - b) : DEFAULT_HOURS);
  const countByCell = new Map(cells.map((cell) => [`${cell.day}|${cell.hour}`, cell.count]));
  const maxCount = Math.max(1, ...cells.map((cell) => cell.count));

  if (!cells.length) {
    return <p className="booking-empty">No booking activity for this range.</p>;
  }

  return (
    <div className="report-heatmap-wrap">
      <table className="report-heatmap">
        <thead>
          <tr>
            <th />
            {days.map((day) => (
              <th key={day}>{day.slice(0, 3)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hourRange.map((hour) => (
            <tr key={hour}>
              <td className="hour-label">{`${hour}-${hour + 1}`}</td>
              {days.map((day) => {
                const count = countByCell.get(`${day}|${hour}`) || 0;
                const color = count ? sequentialStep(count / maxCount) : "#eef2f6";
                return (
                  <td key={day}>
                    <div
                      className="report-heatmap-cell"
                      style={{ background: color }}
                      title={`${day}, ${hour}:00–${hour + 1}:00 — ${count} booking${count === 1 ? "" : "s"}`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
