import NotificationCard from "./NotificationCard";

export default function NotificationList({ notifications = [], onRead, onDelete }) {
  if (!notifications.length) {
    return <p className="booking-empty">No notifications found.</p>;
  }

  return (
    <div className="notification-list">
      {notifications.map((notification) => (
        <NotificationCard
          notification={notification}
          onRead={onRead}
          onDelete={onDelete}
          key={notification._id || notification.id}
        />
      ))}
    </div>
  );
}
