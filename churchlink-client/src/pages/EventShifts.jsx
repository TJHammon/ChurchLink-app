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
      .then(res => res.json())
      .then(data => setEventInfo(data))
      .catch(err => console.error("Event fetch error:", err));
  }, [eventId]);

  // ✅ Fetch shifts (FIXED URL)
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:4000/api/shift/event/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setShifts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Shift fetch error:", err);
        setLoading(false);
      });
  }, [eventId]);

  // ✅ Volunteer signup (FIXED URL)
  const handleSignup = async (shiftId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:4000/api/shift/${shiftId}/signup`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Signup successful!");

      // ✅ Refresh shifts (FIXED URL)
      const updated = await fetch(`http://localhost:4000/api/shift/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedData = await updated.json();
      setShifts(updatedData);

    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  // ✅ Delete shift (FIXED URL)
  const handleDeleteShift = async (shiftId) => {
    if (!window.confirm("Delete this shift?")) return;

    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:4000/api/shift/${shiftId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <p style={{ marginTop: "80px" }}>Loading shifts...</p>;

  return (
    <div className="container" style={{ paddingTop: "80px", textAlign: "center" }}>
      
      <h2>
        Shifts for <span style={{ color: "#44c1f1" }}>
          {eventInfo?.title || "Event"}
        </span>
      </h2>

      <Link to="/events" className="back-button">
        ← Back to Events
      </Link>

      {/* ✅ Admin/TeamLead-only Create Shift button */}
      {["Admin", "TeamLead"].includes(userRole) && (
        <Link
          to={`/events/${eventId}/shifts/new`}
          className="create-shift-button"
          style={{
            display: "inline-block",
            margin: "15px 0",
            padding: "8px 14px",
            background: "#44c1f1",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 600
          }}
        >
          + Create Shift
        </Link>
      )}

      {shifts.length === 0 ? (
        <p>No shifts found.</p>
      ) : (
        <div className="shift-grid">
          {shifts.map((shift) => (
            <div key={shift.id} className="shift-card-wrapper">
              
              <ShiftCard shift={shift} />

              {userRole === "Volunteer" && (
                <button
                  onClick={() => handleSignup(shift.id)}
                  style={{
                    background: "purple",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "8px"
                  }}
                >
                  Sign Up
                </button>
              )}

              {["Admin", "TeamLead"].includes(userRole) && (
                <button
                  onClick={() => handleDeleteShift(shift.id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "8px"
                  }}
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
