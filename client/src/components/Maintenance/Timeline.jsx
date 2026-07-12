const approvedPath = [
  "Maintenance Created",
  "Approved",
  "Technician Assigned",
  "Repair Started",
  "Completed",
];
const rejectedPath = ["Maintenance Created", "Rejected"];

export default function Timeline({ history = [] }) {
  const historyByAction = history.reduce((items, entry) => {
    items[entry.action] = entry;
    return items;
  }, {});
  const phases = historyByAction.Rejected ? rejectedPath : approvedPath;

  return (
    <section className="booking-timeline">
      <h3>Maintenance History</h3>
      <div className="booking-timeline-list">
        {phases.map((phase, index) => {
          const entry = historyByAction[phase];
          return (
            <div
              className={`booking-timeline-item ${entry ? "complete" : ""}`}
              key={phase}
            >
              <span>{index + 1}</span>
              <div>
                <strong>{phase}</strong>
                <p>
                  {entry?.createdAt
                    ? new Date(entry.createdAt).toLocaleString()
                    : "Not recorded yet"}
                </p>
              </div>
              {index < phases.length - 1 ? <i aria-hidden="true">↓</i> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
