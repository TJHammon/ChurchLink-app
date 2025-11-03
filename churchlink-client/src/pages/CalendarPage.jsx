import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarPage.css";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:4000/api/events/volunteer", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Calendar fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading calendar...</p>;

  // Convert event dates to easy comparison
  const eventDates = events.map(e =>
    new Date(e.event_date).toDateString()
  );

  return (
    <div className="calendar-page-container">
      <h2>Calendar</h2>

      <div className="calendar-wrapper">
        <Calendar
          tileClassName={({ date }) => {
            return eventDates.includes(date.toDateString())
              ? "event-date"
              : null;
          }}
        />
      </div>
    </div>
  );
}
