import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import "./VolunteerEvents.css"; // ✅ NEW

export default function VolunteerEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:4000/api/events/volunteer",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching volunteer events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p style={{ marginTop: "80px" }}>Loading events...</p>;
  }

  return (
    <div className="volunteer-page">

      <h1>Volunteer Events</h1>

      {/* ✅ Event Cards */}
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div className="volunteer-events-grid">
          {events.map((event) => (
            <div key={event.id} className="volunteer-card">
              <h2>
                {event.title}
                <br />
                <small>
                  {new Date(event.event_date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </small>
              </h2>

              {/* ✅ View Shifts */}
              <Link to={`/events/${event.id}/shifts`} className="view-shifts-btn">
                View Shifts
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Calendar Section */}
      <div className="calendar-box">
        <h3>Calendar</h3>

        <Calendar
          tileClassName={({ date }) => {
            const eventDates = events.map((e) =>
              new Date(e.event_date).toDateString()
            );

            if (eventDates.includes(date.toDateString())) {
              return "event-date";
            }
          }}
        />
      </div>

    </div>
  );
}
