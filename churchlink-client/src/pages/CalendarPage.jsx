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

        const res = await fetch("http://localhost:4000/api/events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        // Ensure we always store an array
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Calendar fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading)
    return <p style={{ marginTop: "80px" }}>Loading calendar...</p>;

  // ✅ Normalize event dates using LOCAL timezone (YYYY-MM-DD)
  const eventDates = events.map((e) => {
    const d = new Date(e.event_date);
    return d.toLocaleDateString("en-CA"); // "2025-11-05"
  });

  return (
    <div className="calendar-page-container">
      <h1>Calendar</h1>

      <div className="calendar-wrapper">
        <Calendar
          tileClassName={({ date }) => {
            // ✅ Convert calendar tile date to local YYYY-MM-DD
            const local = date.toLocaleDateString("en-CA");

            // ✅ Highlight if it matches an event date
            return eventDates.includes(local) ? "event-date" : null;
          }}
        />
      </div>
    </div>
  );
}
