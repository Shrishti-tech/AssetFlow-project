export default function StatusBadge({ status }) {
  const color =
    {
      Pending: "#64748b",
      Approved: "#2563eb",
      "Technician Assigned": "#7c3aed",
      "In Progress": "#d97706",
      Resolved: "#059669",
      Rejected: "#dc2626",
    }[status] || "#64748b";

  return (
    <span
      style={{
        backgroundColor: `${color}22`,
        color,
        padding: "0.25rem 0.5rem",
        borderRadius: "999px",
        fontSize: "0.85rem",
        fontWeight: 700,
      }}
    >
      {status || "Unknown"}
    </span>
  );
}
