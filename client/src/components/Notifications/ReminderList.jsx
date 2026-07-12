import ReminderCard from "./ReminderCard";

const groupLabels = {
  Return: "Upcoming Returns",
  Maintenance: "Maintenance Due",
  Booking: "Today's Bookings",
  Audit: "Audit Deadlines",
};
const groupOrder = ["Return", "Maintenance", "Booking", "Audit"];

export default function ReminderList({ reminders = [], onCancel }) {
  if (!reminders.length) {
    return <p className="booking-empty">No reminders scheduled.</p>;
  }

  return (
    <div className="reminder-groups">
      {groupOrder.map((type) => {
        const items = reminders.filter((reminder) => reminder.type === type);
        if (!items.length) return null;
        return (
          <section key={type} className="reminder-group">
            <h3>{groupLabels[type]}</h3>
            {items.map((reminder) => (
              <ReminderCard reminder={reminder} onCancel={onCancel} key={reminder._id || reminder.id} />
            ))}
          </section>
        );
      })}
    </div>
  );
}
