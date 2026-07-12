import BookingStatusBadge from "./BookingStatusBadge";

const display = (value) => value || "-";

export default function BookingDetails({ booking }) {
  if (!booking) {
    return (
      <section className="booking-details-card">
        <h3>Booking Details</h3>
        <p>Select a booking to view details.</p>
      </section>
    );
  }

  return (
    <section className="booking-details-card">
      <h3>Booking Details</h3>
      <dl>
        <div>
          <dt>Resource</dt>
          <dd>{display(booking.resource?.name || booking.resource)}</dd>
        </div>
        <div>
          <dt>Employee</dt>
          <dd>
            {display(
              booking.employee?.fullName ||
                booking.employee?.name ||
                booking.employee?.email ||
                booking.employee,
            )}
          </dd>
        </div>
        <div>
          <dt>Department</dt>
          <dd>{display(booking.department)}</dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>
            {booking.bookingDate
              ? new Date(booking.bookingDate).toLocaleDateString()
              : "-"}
          </dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{display(`${booking.startTime || ""} - ${booking.endTime || ""}`)}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <BookingStatusBadge status={booking.status} />
          </dd>
        </div>
        <div>
          <dt>Purpose</dt>
          <dd>{display(booking.purpose)}</dd>
        </div>
        <div>
          <dt>Remarks</dt>
          <dd>{display(booking.remarks)}</dd>
        </div>
      </dl>
    </section>
  );
}
