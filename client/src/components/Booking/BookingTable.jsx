import BookingStatusBadge from "./BookingStatusBadge";

export default function BookingTable({ bookings = [] }) {
  if (!bookings.length) {
    return <p>No bookings found.</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>Resource</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>Purpose</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>Date</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>Time</th>
          <th style={{ textAlign: "left", padding: "0.5rem" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking) => (
          <tr key={booking._id || booking.id}>
            <td style={{ padding: "0.5rem" }}>
              {booking.resource?.name || booking.resource || "—"}
            </td>
            <td style={{ padding: "0.5rem" }}>{booking.purpose || "—"}</td>
            <td style={{ padding: "0.5rem" }}>
              {booking.bookingDate
                ? new Date(booking.bookingDate).toLocaleDateString()
                : "—"}
            </td>
            <td style={{ padding: "0.5rem" }}>
              {booking.startTime} - {booking.endTime}
            </td>
            <td style={{ padding: "0.5rem" }}>
              <BookingStatusBadge status={booking.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
