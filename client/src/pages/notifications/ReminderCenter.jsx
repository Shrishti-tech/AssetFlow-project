import { useEffect, useState } from "react";
import ReminderList from "../../components/Notifications/ReminderList";
import { createReminder, getReminders, updateReminder } from "../../services/notificationService";

const types = ["Booking", "Return", "Maintenance", "Audit"];
const defaultValues = { title: "", message: "", reminderDate: "", type: "Booking" };

export default function ReminderCenter() {
  const [reminders, setReminders] = useState([]);
  const [values, setValues] = useState(defaultValues);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getReminders({ status: "Pending" });
      setReminders(data.reminders || []);
    } catch {
      setNotice("Unable to load reminders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      await createReminder(values);
      setNotice("Reminder created.");
      setValues(defaultValues);
      await load();
    } catch (error) {
      setNotice(error?.response?.data?.message || "Failed to create reminder.");
    }
  };

  const handleCancel = async (id) => {
    try {
      await updateReminder(id, { status: "Cancelled" });
      await load();
    } catch {
      setNotice("Unable to cancel reminder.");
    }
  };

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Notifications &amp; Activity</p>
          <h1>Reminder Center</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <div className="booking-workspace">
        <section className="booking-history-card" style={{ padding: "18px" }}>
          {loading ? (
            <p className="booking-empty">Loading reminders...</p>
          ) : (
            <ReminderList reminders={reminders} onCancel={handleCancel} />
          )}
        </section>
        <aside className="booking-form-card">
          <h2>New Reminder</h2>
          <form onSubmit={handleCreate} className="booking-form">
            <label>
              Title
              <input name="title" value={values.title} onChange={handleChange} required />
            </label>
            <label>
              Type
              <select name="type" value={values.type} onChange={handleChange} required>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Reminder Date &amp; Time
              <input
                type="datetime-local"
                name="reminderDate"
                value={values.reminderDate}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Message
              <textarea name="message" value={values.message} onChange={handleChange} rows="3" />
            </label>
            <button className="booking-submit" type="submit">
              Create Reminder
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}
