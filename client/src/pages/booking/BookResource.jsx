import { useEffect, useState } from "react";
import BookingForm from "../../components/Booking/BookingForm";
import CalendarView from "../../components/Booking/CalendarView";
import { useAuth } from "../../auth/hooks/useAuth";
import { createBooking, getBookings } from "../../services/bookingService";

export default function BookResource() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [recentBookings, setRecentBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const data = await getBookings({ limit: 12 });
      setRecentBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      setRecentBookings([]);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleSubmit = async (values) => {
    try {
      await createBooking(values);
      await loadBookings();
      setMessage("Booking created successfully.");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to create booking.");
    }
  };

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Phase 7</p>
          <h1>Resource Booking</h1>
        </div>
        {message ? <p className="booking-message">{message}</p> : null}
      </div>
      <div className="booking-workspace">
        <CalendarView events={recentBookings} />
        <aside className="booking-form-card">
          <h2>Booking Form</h2>
          <BookingForm
            onSubmit={handleSubmit}
            employee={user?.id}
            department={user?.department}
          />
        </aside>
      </div>
    </main>
  );
}
