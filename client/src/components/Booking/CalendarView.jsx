import { useMemo, useState } from "react";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = Array.from({ length: 11 }, (_, index) => index + 8);
const demoEvents = [
  {
    id: "demo-room-a-9",
    title: "Team sync",
    resource: "Meeting Room A",
    start: `${new Date().toISOString().slice(0, 10)}T09:00`,
    end: `${new Date().toISOString().slice(0, 10)}T10:00`,
    status: "Upcoming",
  },
  {
    id: "demo-room-a-10",
    title: "Planning",
    resource: "Meeting Room A",
    start: `${new Date().toISOString().slice(0, 10)}T10:00`,
    end: `${new Date().toISOString().slice(0, 10)}T11:00`,
    status: "Upcoming",
  },
];

const toDateKey = (date) => date.toISOString().slice(0, 10);
const toMinutes = (time = "00:00") => {
  const [hoursPart, minutesPart] = time.split(":").map(Number);
  return hoursPart * 60 + minutesPart;
};
const formatHour = (hour) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 || 12;
  return `${display} ${suffix}`;
};
const formatRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} - ${endDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
};
const startOfWeek = (date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
};
const monthDays = (date) => {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, index) => {
    const item = new Date(start);
    item.setDate(start.getDate() + index);
    return item;
  });
};
const weekDays = (date) => {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => {
    const item = new Date(start);
    item.setDate(start.getDate() + index);
    return item;
  });
};
const normalizeEvent = (event) => {
  const start = event.start
    ? new Date(event.start)
    : new Date(`${event.bookingDate?.slice?.(0, 10)}T${event.startTime || "09:00"}`);
  const end = event.end
    ? new Date(event.end)
    : new Date(`${event.bookingDate?.slice?.(0, 10)}T${event.endTime || "10:00"}`);

  return {
    ...event,
    id: event.id || event._id || `${event.resource}-${start.toISOString()}`,
    title: event.title || event.purpose || "Booking",
    resource: event.resource?.name || event.resource || "Meeting Room A",
    start,
    end,
    dateKey: toDateKey(start),
  };
};

export default function CalendarView({ events = [] }) {
  const [view, setView] = useState("week");
  const [focusDate, setFocusDate] = useState(new Date());
  const calendarEvents = useMemo(
    () => (events.length ? events : demoEvents).map(normalizeEvent),
    [events],
  );
  const resources = useMemo(
    () => [...new Set(calendarEvents.map((event) => event.resource))],
    [calendarEvents],
  );
  const week = weekDays(focusDate);
  const month = monthDays(focusDate);
  const dayKey = toDateKey(focusDate);

  const move = (direction) => {
    setFocusDate((current) => {
      const next = new Date(current);
      if (view === "month") next.setMonth(current.getMonth() + direction);
      if (view === "week") next.setDate(current.getDate() + direction * 7);
      if (view === "day") next.setDate(current.getDate() + direction);
      return next;
    });
  };

  const eventsForDate = (date) =>
    calendarEvents.filter((event) => event.dateKey === toDateKey(date));

  return (
    <section className="booking-calendar">
      <div className="booking-calendar-toolbar">
        <div>
          <p className="booking-kicker">Calendar</p>
          <h2>
            {focusDate.toLocaleDateString([], {
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>
        <div className="booking-calendar-actions">
          <button type="button" onClick={() => move(-1)} aria-label="Previous">
            ‹
          </button>
          <button type="button" onClick={() => setFocusDate(new Date())}>
            Today
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Next">
            ›
          </button>
          <div className="booking-view-tabs">
            {["month", "week", "day"].map((item) => (
              <button
                type="button"
                className={view === item ? "active" : ""}
                onClick={() => setView(item)}
                key={item}
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "month" ? (
        <div className="booking-month-grid">
          {dayNames.map((day) => (
            <strong key={day}>{day}</strong>
          ))}
          {month.map((date) => (
            <button
              type="button"
              className={`booking-month-day ${date.getMonth() !== focusDate.getMonth() ? "muted" : ""}`}
              key={date.toISOString()}
              onClick={() => {
                setFocusDate(date);
                setView("day");
              }}
            >
              <span>{date.getDate()}</span>
              {eventsForDate(date)
                .slice(0, 3)
                .map((event) => (
                  <i key={event.id}>{event.resource}</i>
                ))}
            </button>
          ))}
        </div>
      ) : null}

      {view === "week" ? (
        <div className="booking-week-grid">
          <div className="booking-week-header">
            <div className="booking-time-head" />
            {week.map((date) => (
              <button
                type="button"
                className={toDateKey(date) === dayKey ? "active" : ""}
                key={date.toISOString()}
                onClick={() => {
                  setFocusDate(date);
                  setView("day");
                }}
              >
                <span>{dayNames[date.getDay()]}</span>
                <b>{date.getDate()}</b>
              </button>
            ))}
          </div>
          <div className="booking-week-body">
            <div>
              {hours.map((hour) => (
                <div className="booking-time-label" key={`time-${hour}`}>
                  {formatHour(hour)}
                </div>
              ))}
            </div>
            {week.map((date) => (
              <div className="booking-day-column" key={`col-${date.toISOString()}`}>
                {hours.map((hour) => (
                  <span key={`${date.toISOString()}-${hour}`} />
                ))}
                {eventsForDate(date).map((event) => {
                  const top =
                    ((toMinutes(event.start.toTimeString().slice(0, 5)) - 8 * 60) / 60) *
                    56;
                  const height = Math.max(
                    ((event.end - event.start) / 1000 / 60 / 60) * 56,
                    32,
                  );
                  return (
                    <article
                      className="booking-event-block"
                      style={{ top, height }}
                      key={event.id}
                    >
                      <strong>{event.resource}</strong>
                      <span>{formatRange(event.start, event.end)}</span>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {view === "day" ? (
        <div className="booking-day-schedule">
          <div className="booking-day-title">
            <span>
              {focusDate.toLocaleDateString([], {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
            <b>{resources.length} resources</b>
          </div>
          <div className="booking-resource-board">
            <div className="booking-resource-times">
              {hours.map((hour) => (
                <span key={hour}>{`${hour}-${hour + 1}`}</span>
              ))}
            </div>
            {resources.map((resource) => (
              <div className="booking-resource-lane" key={resource}>
                <h3>{resource}</h3>
                {hours.map((hour) => (
                  <span key={hour} />
                ))}
                {calendarEvents
                  .filter((event) => event.dateKey === dayKey && event.resource === resource)
                  .map((event) => {
                    const top =
                      36 +
                      ((toMinutes(event.start.toTimeString().slice(0, 5)) - 8 * 60) / 60) *
                        48;
                    const height = Math.max(
                      ((event.end - event.start) / 1000 / 60 / 60) * 48,
                      28,
                    );
                    return (
                      <article
                        className="booking-event-block booking-event-block--day"
                        style={{ top, height }}
                        key={event.id}
                      >
                        <strong>{formatRange(event.start, event.end)}</strong>
                        <span>{event.title}</span>
                      </article>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
