import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


const VolunteerEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("JWT token:", token); // temporary log so we can verify

        const response = await axios.get(
          "http://localhost:4000/api/events/volunteer",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Fetched events:", response.data); // debug log
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;

    return (
    <div className="volunteer-events">
      <h2>My Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.title}</strong>
              <p>{event.description}</p>
              <p>
                <em>{new Date(event.event_date).toLocaleString()}</em>
              </p>

              <a 
                href={`/events/${event.id}/shifts`} 
                className="view-shifts-btn"
              >
                View Shifts
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="calendar-section">
        <h3>Calendar View</h3>
        <Calendar
  tileClassName={({ date }) => {
    const eventDates = events.map(
      (e) => new Date(e.event_date).toDateString()
    );
    if (eventDates.includes(date.toDateString())) {
      return "event-date";
    }
  }}
/>

      </div>
    </div>
  );
};

export default VolunteerEvents;
