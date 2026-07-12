const colors = {
  Scheduled: "#64748b",
  "In Progress": "#2563eb",
  Completed: "#059669",
  Cancelled: "#dc2626",
  Verified: "#059669",
  Missing: "#d97706",
  Damaged: "#dc2626",
  Lost: "#7c3aed",
  Assigned: "#64748b",
  Accepted: "#2563eb",
};

export default function AuditStatusBadge({ status }) {
  const color = colors[status] || "#64748b";

  return (
    <span
      className="audit-badge"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {status || "Unknown"}
    </span>
  );
}
