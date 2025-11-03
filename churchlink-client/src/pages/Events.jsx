import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-center" style={{ minHeight: "auto", paddingTop: "40px" }}>
      <h1>Events</h1>

      <p style={{ maxWidth: "600px", opacity: 0.9, marginTop: "10px" }}>
        To sign up for an event, click on the event and select a shift.
      </p>

      {/* ✅ Loading State */}
      {loading && <p>Loading events...</p>}

      {/* ✅ Event Cards */}
      {!loading && (
        <div
          className="card-grid"
          style={{ marginTop: "40px", width: "100%", maxWidth: "900px" }}
        >
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}/shifts`}
              className="card"
              style={{ textDecoration: "none" }}
            >
              <h2>
                {event.title}
                <br />
                <small>
                  {new Date(event.event_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </small>
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
