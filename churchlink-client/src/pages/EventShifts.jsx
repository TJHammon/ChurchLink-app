import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ShiftCard from "../components/ShiftCard.jsx";

export default function EventShifts() {
  const { eventId } = useParams();

  const [eventInfo, setEventInfo] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem("role");

  // ✅ Fetch event title
  useEffect(() => {
    fetch(`http://localhost:4000/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => setEventInfo(data))
      .catch((err) => console.error("Event fetch error:", err));
  }, [eventId]);

  // ✅ Fetch shifts
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:4000/api/shift/event/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setShifts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Shift fetch error:", err);
        setLoading(false);
      });
  }, [eventId]);

  // ✅ Volunteer signup
  const handleSignup = async (shiftId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:4000/api/shift/${shiftId}/signup`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Signup successful!");

      // Refresh shifts
      const updated = await fetch(
        `http://localhost:4000/api/shift/event/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedData = await updated.json();
      setShifts(updatedData);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  // ✅ Delete shift
  const handleDeleteShift = async (shiftId) => {
    if (!window.confirm("Delete this shift?")) return;

    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:4000/api/shift/${shiftId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading)
    return <p style={{ marginTop: "100px" }}>Loading shifts...</p>;

  return (
    <div className="event-shifts-container">

      {/* ✅ HEADER */}
      <div className="event-header">
        <h1 className="event-title">{eventInfo?.title || "Event"}</h1>

        <div className="event-header-actions">
          <Link to="/events" className="back-button">
            ← Back to Events
          </Link>

          {["Admin", "TeamLead"].includes(userRole) && (
            <Link
              to={`/events/${eventId}/shifts/new`}
              className="create-shift-btn"
            >
              + Create Shift
            </Link>
          )}
        </div>
      </div>

      {/* ✅ SHIFT GRID */}
      {shifts.length === 0 ? (
        <p className="no-shifts-message">No shifts found.</p>
      ) : (
        <div className="shift-grid">
          {shifts.map((shift) => (
            <div key={shift.id} className="shift-card-wrapper">
              <ShiftCard shift={shift} />

              {/* ✅ Volunteer SIGN UP */}
              {userRole === "Volunteer" && (
                <button
                  className="signup-btn"
                  onClick={() => handleSignup(shift.id)}
                >
                  Sign Up
                </button>
              )}

              {/* ✅ Admin Delete */}
              {["Admin", "TeamLead"].includes(userRole) && (
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteShift(shift.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
