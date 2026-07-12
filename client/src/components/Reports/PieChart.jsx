import { CATEGORY_COLORS, OTHER_COLOR } from "./colors";

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 2;

export default function PieChart({ data = [] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const maxSlices = CATEGORY_COLORS.length;
  const primary = data.slice(0, maxSlices);
  const rest = data.slice(maxSlices);
  const otherValue = rest.reduce((sum, item) => sum + item.value, 0);
  const slices = otherValue > 0 ? [...primary, { label: "Other", value: otherValue }] : primary;

  if (!slices.length) {
    return <p className="booking-empty">No data available.</p>;
  }

  let offset = 0;

  return (
    <div className="report-pie-wrap">
      <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label="Distribution chart">
        <g transform="translate(80,80) rotate(-90)">
          <circle r={RADIUS} fill="none" stroke="#eef2f6" strokeWidth="24" />
          {slices.map((slice, index) => {
            const isOther = otherValue > 0 && index === slices.length - 1;
            const color = isOther ? OTHER_COLOR : CATEGORY_COLORS[index % CATEGORY_COLORS.length];
            const fraction = slice.value / total;
            const rawDash = fraction * CIRCUMFERENCE;
            const dash = Math.max(0, rawDash - GAP);
            const element = (
              <circle
                key={`${slice.label}-${index}`}
                r={RADIUS}
                fill="none"
                stroke={color}
                strokeWidth="24"
                strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += rawDash;
            return element;
          })}
        </g>
      </svg>
      <ul className="report-legend">
        {slices.map((slice, index) => {
          const isOther = otherValue > 0 && index === slices.length - 1;
          const color = isOther ? OTHER_COLOR : CATEGORY_COLORS[index % CATEGORY_COLORS.length];
          const percent = Math.round((slice.value / total) * 100);
          return (
            <li className="report-legend-item" key={`${slice.label}-${index}`}>
              <span className="report-legend-swatch" style={{ background: color }} />
              {slice.label} — {percent}%
            </li>
          );
        })}
      </ul>
    </div>
  );
}
