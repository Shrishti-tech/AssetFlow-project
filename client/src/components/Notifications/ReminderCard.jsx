import { relativeDay } from "../../utils/dateHelpers";

const statusColors = {
  Pending: "#2563eb",
  Sent: "#059669",
  Cancelled: "#dc2626",
};

export default function ReminderCard({ reminder, onCancel }) {
  const id = reminder._id || reminder.id;
  const color = statusColors[reminder.status] || "#64748b";

  return (
    <article className="reminder-card">
      <div>
        <span className="reminder-day">{relativeDay(reminder.reminderDate)}</span>
        <h3>{reminder.title}</h3>
        {reminder.message ? <p>{reminder.message}</p> : null}
        <small>
          {new Date(reminder.reminderDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </small>
      </div>
      <div className="reminder-card-actions">
        <span style={{ backgroundColor: `${color}22`, color, padding: "0.2rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700 }}>
          {reminder.status}
        </span>
        {reminder.status === "Pending" ? (
          <button type="button" onClick={() => onCancel?.(id)}>
            Cancel
          </button>
        ) : null}
      </div>
    </article>
  );
}
