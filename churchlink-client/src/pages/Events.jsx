import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// ✅ Map event titles → image files in /public
const eventImages = {
  "Men's Breakfast": "/mensbreakfast.avif",
  "Youth Night": "/youthnight.avif",
  "Women's Breakfast": "/womanbreakfast.avif",
  "Prayer Group": "/prayer.avif",
  "Lego Night": "/lego.avif",
  "Senior's Brunch": "/brunch.avif",
  "Bible Study": "/study.avif",
  "Thanksgiving Carry-In": "/thanksgiving.avif",
  "Wedding": "/wedding.avif",
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetch("http://localhost:4000/api/events")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(a.event_date) - new Date(b.event_date)
        );
        setEvents(sorted);
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

      {!loading && (
        <>
          {/* ✅ Event Cards */}
          <div
            className="events-grid"
            style={{ width: "100%", maxWidth: "900px", marginTop: "40px" }}
          >
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}/shifts`}
                className="event-card image-event-card"
                style={{
                  textDecoration: "none",
                  backgroundImage: `url(${eventImages[event.title] || "/default.avif"})`,
                }}
              >
                <div className="event-card-overlay"></div>

                <h2>
                  {event.title}
                  <br />
                  <small style={{ fontWeight: "400" }}>
                    {new Date(event.event_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </small>
                </h2>
              </Link>
            ))}
          </div>

          {/* ✅ Admin-only Create Event button */}
          {userRole === "Admin" && (
            <div style={{ marginTop: "40px", textAlign: "center" }}>
              <Link
                to="/events/new"
                style={{
                  padding: "12px 24px",
                  background: "#44c1f1",
                  color: "#1D202F",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                + Create Event
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
