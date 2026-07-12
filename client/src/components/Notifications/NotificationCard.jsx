import NotificationBadge from "./NotificationBadge";
import { timeAgo } from "../../utils/dateHelpers";

export default function NotificationCard({ notification, onRead, onDelete }) {
  const id = notification._id || notification.id;

  return (
    <article className={`notification-item ${notification.isRead ? "read" : ""}`}>
      <div>
        <span>{notification.type}</span>
        <h3>{notification.title}</h3>
        <p>{notification.message}</p>
        <div className="notification-card-meta">
          <NotificationBadge priority={notification.priority} />
          <small>{timeAgo(notification.createdAt)}</small>
        </div>
      </div>
      <div className="booking-table-actions">
        {!notification.isRead ? (
          <button type="button" onClick={() => onRead?.(id)}>
            Mark Read
          </button>
        ) : null}
        <button type="button" className="danger" onClick={() => onDelete?.(id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
