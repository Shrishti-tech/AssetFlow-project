export default function PriorityBadge({ priority }) {
  const color =
    {
      Low: "#0891b2",
      Medium: "#d97706",
      High: "#dc2626",
      Critical: "#991b1b",
    }[priority] || "#64748b";

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
      {priority || "Unknown"}
    </span>
  );
}
