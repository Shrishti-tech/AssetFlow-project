import { useEffect, useState } from "react";
import CalendarView from "../../components/Booking/CalendarView";
import { getBookingCalendar } from "../../services/bookingService";

export default function BookingCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getBookingCalendar();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        setEvents([]);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="page-shell">
      <h2>Booking calendar</h2>
      <CalendarView events={events} />
    </div>
  );
}
