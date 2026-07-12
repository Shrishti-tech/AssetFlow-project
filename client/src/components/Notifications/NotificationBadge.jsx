const colors = {
  Low: "#64748b",
  Medium: "#2563eb",
  High: "#d97706",
  Critical: "#dc2626",
};

export default function NotificationBadge({ priority }) {
  const color = colors[priority] || "#64748b";

  return (
    <span
      style={{
        backgroundColor: `${color}22`,
        color,
        padding: "0.2rem 0.5rem",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 700,
      }}
    >
      {priority || "Medium"}
    </span>
  );
}
