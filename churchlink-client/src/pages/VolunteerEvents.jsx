import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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
    <div className="page-center" style={{ paddingTop: "80px", textAlign: "center" }}>
      <h1>Volunteer Events</h1>

      {/* ✅ Event Cards */}
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div
          className="card-grid"
          style={{
            marginTop: "40px",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          {events.map((event) => (
            <div key={event.id} className="card">
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

              {/* ✅ View Shifts button */}
              <Link
                to={`/events/${event.id}/shifts`}
                style={{
                  marginTop: "15px",
                  display: "inline-block",
                  padding: "8px 16px",
                  background: "#44c1f1",
                  color: "#000",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                View Shifts
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Calendar Section */}
      <div
        style={{
          marginTop: "60px",
          width: "100%",
          maxWidth: "320px",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "20px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "12px",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Calendar</h3>

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

      {/* ✅ Highlight event days on calendar */}
      <style>
        {`
          .event-date {
            background-color: #44c1f1 !important;
            color: black !important;
            border-radius: 8px;
          }

          .react-calendar {
            background: #1d202f !important;
            color: white !important;
            border: none !important;
            border-radius: 12px;
          }

          .react-calendar__navigation button {
            color: white !important;
          }

          .react-calendar__tile {
            color: white !important;
          }

          .react-calendar__month-view__days__day--weekend {
            color: #ccc !important;
          }
        `}
      </style>
    </div>
  );
}
