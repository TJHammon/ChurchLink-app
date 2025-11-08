import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ShiftCard from "../components/ShiftCard.jsx";

export default function EventShifts() {
  const { eventId } = useParams();

  const [eventInfo, setEventInfo] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPopup, setShowPopup] = useState(false);     // ✅ popup control
  const [selectedShift, setSelectedShift] = useState(null); // ✅ track shift

  const userRole = localStorage.getItem("role");

  // ✅ Fetch event title
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:4000/api/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setEventInfo(data))
      .catch((err) => console.error("Event fetch error:", err));
  }, [eventId]);

  // ✅ Fetch shifts
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:4000/api/shifts/event/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
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

  // ✅ Delete shift
  const handleDeleteShift = async (shiftId) => {
    if (!window.confirm("Delete this shift?")) return;

    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:4000/api/shifts/${shiftId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ Open popup for volunteer signup
  const handleSignupClick = (shiftId) => {
    setSelectedShift(shiftId);
    setShowPopup(true);
  };

  // ✅ Confirm signup runs only after popup approves
  const confirmSignup = async () => {
    const shiftId = selectedShift;
    setShowPopup(false);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:4000/api/shifts/${shiftId}/signup`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Signup successful!");

      // ✅ Refresh shifts
      const updated = await fetch(
        `http://localhost:4000/api/shifts/event/${eventId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );

      const updatedData = await updated.json();
      setShifts(updatedData);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  if (loading)
    return <p style={{ marginTop: "100px" }}>Loading shifts...</p>;

  return (
    <div className="event-shifts-container">

      {/* ✅ Event Title */}
      <div className="event-header">
        <h1 className="event-title">{eventInfo?.title || "Event"}</h1>
      </div>

      {/* ✅ Shift Grid */}
      {shifts.length === 0 ? (
        <p className="no-shifts-message">No shifts found.</p>
      ) : (
        <div className="shift-grid">
          {shifts.map((shift) => (
            <div key={shift.id} className="shift-card-wrapper">
              <ShiftCard
                shift={shift}
                onDelete={handleDeleteShift}
                onSignup={handleSignupClick}  // ✅ popup trigger
              />
            </div>
          ))}
        </div>
      )}

      {/* ✅ Footer Actions (bottom of page) */}
      <div className="event-footer-actions" style={{ marginTop: "40px" }}>
        <Link to="/events" className="back-button">← Back to Events</Link>

        {["Admin", "TeamLead"].includes(userRole) && (
          <Link
            to={`/events/${eventId}/shifts/new`}
            className="create-shift-btn"
          >
            + Create Shift
          </Link>
        )}
      </div>

      {/* ✅ SIGNUP POPUP */}
      {showPopup && (
        <div className="signup-popup-overlay">
          <div className="signup-popup">
            <h2>Sign up for this shift?</h2>

            <div className="popup-buttons">
              <button onClick={confirmSignup} className="confirm-btn">
                Confirm
              </button>

              <button
                onClick={() => setShowPopup(false)}
                className="cancel-btn"
              >
                No Thanks
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
