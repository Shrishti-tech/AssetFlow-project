import { useEffect, useState } from "react";
import {
  createBookingReminders,
  getNotifications,
  markNotificationRead,
} from "../../services/notificationService";

const triggers = [
  "Booking Created",
  "Booking Updated",
  "Booking Cancelled",
  "Booking Reminder",
  "Booking Completed",
];

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [activeTrigger, setActiveTrigger] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const loadNotifications = async (trigger = activeTrigger) => {
    setLoading(true);
    try {
      const data = await getNotifications(trigger ? { trigger } : {});
      setNotifications(data.notifications || []);
    } catch (error) {
      setNotifications([]);
      setNotice("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const selectTrigger = async (trigger) => {
    const nextTrigger = activeTrigger === trigger ? "" : trigger;
    setActiveTrigger(nextTrigger);
    await loadNotifications(nextTrigger);
  };

  const markRead = async (id) => {
    try {
      await markNotificationRead(id);
      await loadNotifications();
    } catch (error) {
      setNotice("Unable to update notification.");
    }
  };

  const runReminderTrigger = async () => {
    try {
      const data = await createBookingReminders();
      setNotice(`${data.notifications?.length || 0} booking reminders created.`);
      setActiveTrigger("Booking Reminder");
      await loadNotifications("Booking Reminder");
    } catch (error) {
      setNotice("Unable to create booking reminders.");
    }
  };

  useEffect(() => {
    loadNotifications("");
  }, []);

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Phase 10</p>
          <h1>Notifications</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>

      <section className="notification-workspace">
        <aside className="notification-triggers">
          <h2>Triggers</h2>
          {triggers.map((trigger) => (
            <button
              type="button"
              className={activeTrigger === trigger ? "active" : ""}
              onClick={() => selectTrigger(trigger)}
              key={trigger}
            >
              {trigger}
            </button>
          ))}
          <button
            type="button"
            className="notification-reminder-btn"
            onClick={runReminderTrigger}
          >
            Create booking reminders
          </button>
        </aside>

        <section className="notification-list">
          <h2>{activeTrigger || "All Booking Notifications"}</h2>
          {loading ? <p className="booking-empty">Loading notifications...</p> : null}
          {!loading && !notifications.length ? (
            <p className="booking-empty">No notifications found.</p>
          ) : null}
          {!loading
            ? notifications.map((notification) => (
                <article
                  className={`notification-item ${notification.read ? "read" : ""}`}
                  key={notification._id || notification.id}
                >
                  <div>
                    <span>{notification.trigger}</span>
                    <h3>{notification.title}</h3>
                    <p>{notification.message}</p>
                    <small>
                      {notification.createdAt
                        ? new Date(notification.createdAt).toLocaleString()
                        : ""}
                    </small>
                  </div>
                  {!notification.read ? (
                    <button
                      type="button"
                      onClick={() => markRead(notification._id || notification.id)}
                    >
                      Mark read
                    </button>
                  ) : null}
                </article>
              ))
            : null}
        </section>
      </section>
    </main>
  );
}
