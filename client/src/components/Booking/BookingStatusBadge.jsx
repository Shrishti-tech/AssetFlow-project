export default function BookingStatusBadge({ status }) {
  const color =
    {
      Upcoming: "#2563eb",
      Ongoing: "#059669",
      Completed: "#7c3aed",
      Cancelled: "#dc2626",
    }[status] || "#64748b";

  return (
    <span
      style={{
        backgroundColor: `${color}22`,
        color,
        padding: "0.25rem 0.5rem",
        borderRadius: "999px",
        fontSize: "0.85rem",
      }}
    >
      {status || "Unknown"}
    </span>
  );
}
