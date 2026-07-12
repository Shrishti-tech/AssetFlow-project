import { useEffect, useState } from "react";
import BookingForm from "../../components/Booking/BookingForm";
import { createBooking, getBookings } from "../../services/bookingService";

export default function BookResource() {
  const [message, setMessage] = useState("");
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getBookings({ limit: 5 });
        setRecentBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        setRecentBookings([]);
      }
    };

    loadBookings();
  }, []);

  const handleSubmit = async (values) => {
    try {
      await createBooking(values);
      setMessage("Booking created successfully.");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to create booking.");
    }
  };

  return (
    <div className="page-shell">
      <h2>Book resource</h2>
      {message ? <p>{message}</p> : null}
      <BookingForm onSubmit={handleSubmit} />
      <div style={{ marginTop: "1.5rem" }}>
        <h3>Recent bookings</h3>
        {recentBookings.length ? (
          <ul>
            {recentBookings.map((booking) => (
              <li key={booking._id || booking.id}>
                {booking.purpose || "Booking"} •{" "}
                {booking.resource?.name || booking.resource || "—"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent bookings.</p>
        )}
      </div>
    </div>
  );
}
