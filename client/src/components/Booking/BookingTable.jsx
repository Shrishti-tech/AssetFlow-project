import BookingStatusBadge from "./BookingStatusBadge";

const resourceName = (booking) => booking.resource?.name || booking.resource || "-";
const employeeName = (booking) =>
  booking.employee?.fullName ||
  booking.employee?.name ||
  booking.employee?.email ||
  booking.employee ||
  "-";
const bookingDate = (booking) =>
  booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "-";
const bookingTime = (booking) =>
  booking.startTime && booking.endTime ? `${booking.startTime} - ${booking.endTime}` : "-";

export default function BookingTable({
  bookings = [],
  onView,
  onEdit,
  onCancel,
}) {
  if (!bookings.length) {
    return <p className="booking-empty">No bookings found.</p>;
  }

  return (
    <div className="booking-table-wrap">
      <table className="booking-table">
        <thead>
          <tr>
            <th>Resource</th>
            <th>Employee</th>
            <th>Department</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id || booking.id}>
              <td>{resourceName(booking)}</td>
              <td>{employeeName(booking)}</td>
              <td>{booking.department || "-"}</td>
              <td>{bookingDate(booking)}</td>
              <td>{bookingTime(booking)}</td>
              <td>
                <BookingStatusBadge status={booking.status} />
              </td>
              <td>
                <div className="booking-table-actions">
                  <button type="button" onClick={() => onView?.(booking)}>
                    View
                  </button>
                  <button type="button" onClick={() => onEdit?.(booking)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => onCancel?.(booking)}
                    disabled={booking.status === "Cancelled"}
                  >
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
