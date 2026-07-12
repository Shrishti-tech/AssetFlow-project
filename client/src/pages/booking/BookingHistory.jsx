import { useEffect, useState } from "react";
import BookingTable from "../../components/Booking/BookingTable";
import { getBookings } from "../../services/bookingService";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  return (
    <div className="page-shell">
      <h2>Booking history</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <BookingTable bookings={bookings} />
      )}
    </div>
  );
}
