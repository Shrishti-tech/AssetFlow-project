export default function CalendarView({ events = [] }) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "0.75rem",
        padding: "1rem",
      }}
    >
      <h3>Upcoming bookings</h3>
      {events.length ? (
        <ul>
          {events.map((event) => (
            <li key={event.id || event._id}>
              {event.title} — {event.resource} ({event.start} to {event.end})
            </li>
          ))}
        </ul>
      ) : (
        <p>No calendar events.</p>
      )}
    </div>
  );
}
