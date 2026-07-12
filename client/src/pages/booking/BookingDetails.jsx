export default function BookingDetails({ booking }) {
  if (!booking) {
    return <p>Select a booking to view details.</p>;
  }

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "0.75rem",
        padding: "1rem",
      }}
    >
      <h3>Booking details</h3>
      <p>
        <strong>Purpose:</strong> {booking.purpose || "—"}
      </p>
      <p>
        <strong>Resource:</strong>{" "}
        {booking.resource?.name || booking.resource || "—"}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {booking.bookingDate
          ? new Date(booking.bookingDate).toLocaleDateString()
          : "—"}
      </p>
      <p>
        <strong>Time:</strong> {booking.startTime} - {booking.endTime}
      </p>
      <p>
        <strong>Status:</strong> {booking.status || "—"}
      </p>
      <p>
        <strong>Remarks:</strong> {booking.remarks || "—"}
      </p>
    </div>
  );
}
