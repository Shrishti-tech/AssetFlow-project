export default function HistoryTimeline({ items = [] }) {
  if (!items.length) {
    return <div className="asset-timeline-empty">No history available.</div>;
  }

  return (
    <div className="asset-timeline">
      {items.map((item, index) => (
        <div className="asset-timeline-item" key={`${item.title}-${index}`}>
          <div className="asset-timeline-marker" />
          <div className="asset-timeline-content">
            <div className="asset-timeline-head">
              <strong>{item.title}</strong>
              <span>{item.date}</span>
            </div>
            {item.description ? <p>{item.description}</p> : null}
            {item.user ? <small>By {item.user}</small> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
