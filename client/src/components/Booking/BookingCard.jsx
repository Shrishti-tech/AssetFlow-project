export default function BookingCard({ booking }) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "0.75rem",
        padding: "1rem",
        marginBottom: "0.75rem",
      }}
    >
      <strong>{booking.purpose || "Booking"}</strong>
      <p style={{ margin: "0.25rem 0" }}>
        {booking.resource?.name || booking.resource || "Resource"} •{" "}
        {booking.startTime} - {booking.endTime}
      </p>
      <p style={{ margin: 0, color: "#475569" }}>
        {booking.bookingDate
          ? new Date(booking.bookingDate).toLocaleDateString()
          : ""}
      </p>
    </div>
  );
}
