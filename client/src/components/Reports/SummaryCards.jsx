export default function SummaryCards({ items }) {
  if (!items?.length) return null;

  return (
    <div className="report-summary-grid">
      {items.map((item) => (
        <div key={item.label} className={`report-stat${item.tone ? ` report-stat--${item.tone}` : ""}`}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}
