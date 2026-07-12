import { useEffect, useState } from "react";
import NotificationList from "../../components/Notifications/NotificationList";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/notificationService";

const types = ["Asset", "Booking", "Maintenance", "Audit", "System"];

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const query = {};
      if (type) query.type = type;
      if (search) query.search = search;
      const data = await getNotifications(query);
      setNotifications(data.notifications || []);
    } catch {
      setNotice("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleSearch = (event) => {
    event.preventDefault();
    load();
  };

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      await load();
    } catch {
      setNotice("Unable to update notification.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      await load();
    } catch {
      setNotice("Unable to delete notification.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotice("All notifications marked as read.");
      await load();
    } catch {
      setNotice("Unable to mark all notifications as read.");
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Notifications &amp; Activity</p>
          <h1>🔔 Notifications</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>

      <div className="booking-calendar-toolbar" style={{ marginBottom: "12px" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px", flex: 1 }}>
          <input
            type="search"
            placeholder="Search notifications..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">All types</option>
          {types.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleMarkAllRead} disabled={!unreadCount}>
          Mark all read ({unreadCount})
        </button>
      </div>

      <section className="booking-history-card" style={{ padding: "18px" }}>
        {loading ? (
          <p className="booking-empty">Loading notifications...</p>
        ) : (
          <NotificationList notifications={notifications} onRead={handleRead} onDelete={handleDelete} />
        )}
      </section>
    </main>
  );
}
