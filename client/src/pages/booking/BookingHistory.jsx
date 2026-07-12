import { useEffect, useMemo, useState } from "react";
import BookingDetails from "../../components/Booking/BookingDetails";
import BookingForm from "../../components/Booking/BookingForm";
import BookingTable from "../../components/Booking/BookingTable";
import BookingTimeline from "../../components/Booking/BookingTimeline";
import {
  cancelBooking,
  getBookingHistory,
  getBookings,
  updateBooking,
} from "../../services/bookingService";

const idFor = (value) => value?._id || value?.id || value || "";
const formValuesFor = (booking) => ({
  resource: idFor(booking.resource),
  employee: idFor(booking.employee),
  department: booking.department || "",
  purpose: booking.purpose || "",
  bookingDate: booking.bookingDate
    ? new Date(booking.bookingDate).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10),
  startTime: booking.startTime || "09:00",
  endTime: booking.endTime || "10:00",
  remarks: booking.remarks || "",
});

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const selectedId = idFor(selectedBooking);
  const editInitialValues = useMemo(
    () => (editingBooking ? formValuesFor(editingBooking) : null),
    [editingBooking],
  );

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      setBookings([]);
      setNotice("Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const viewBooking = async (booking) => {
    setSelectedBooking(booking);
    setEditingBooking(null);
    try {
      const data = await getBookingHistory(idFor(booking));
      setTimeline(Array.isArray(data) ? data : []);
    } catch (error) {
      setTimeline([]);
    }
  };

  const editBooking = (booking) => {
    setSelectedBooking(booking);
    setEditingBooking(booking);
    setTimeline([]);
  };

  const submitEdit = async (values) => {
    if (!editingBooking) return;
    try {
      await updateBooking(idFor(editingBooking), values);
      setNotice("Booking updated.");
      setEditingBooking(null);
      await loadBookings();
    } catch (error) {
      setNotice(error?.response?.data?.message || "Failed to update booking.");
    }
  };

  const cancelSelected = async (booking) => {
    try {
      await cancelBooking(idFor(booking), {
        remarks: "Cancelled from booking table.",
      });
      setNotice("Booking cancelled.");
      await loadBookings();
      if (selectedId === idFor(booking)) {
        await viewBooking({ ...booking, status: "Cancelled" });
      }
    } catch (error) {
      setNotice(error?.response?.data?.message || "Failed to cancel booking.");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Phase 8 / Phase 9</p>
          <h1>Booking History</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <div className="booking-history-layout">
        <section className="booking-history-card">
          {loading ? (
            <p className="booking-empty">Loading bookings...</p>
          ) : (
            <BookingTable
              bookings={bookings}
              onView={viewBooking}
              onEdit={editBooking}
              onCancel={cancelSelected}
            />
          )}
        </section>
        <aside className="booking-history-side">
          {editingBooking ? (
            <>
              <h2>Edit Booking</h2>
              <BookingForm
                initialValues={editInitialValues}
                employee={idFor(editingBooking.employee)}
                department={editingBooking.department}
                submitLabel="Update booking"
                onSubmit={submitEdit}
              />
            </>
          ) : (
            <>
              <BookingDetails booking={selectedBooking} />
              <BookingTimeline history={timeline} />
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
