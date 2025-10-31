import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ShiftCard from "../components/ShiftCard.jsx";

export default function EventShifts() {
  const { eventId } = useParams();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem("role");

  // ✅ Fetch shifts
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:4000/api/shifts/event/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Shifts:", data);
        setShifts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [eventId]);

  // ✅ VOLUNTEER SIGNUP HANDLER
  const handleSignup = async (shiftId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:4000/api/shifts/${shiftId}/signup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Signup successful!");

      // ✅ Re-fetch shifts to update volunteer count
      const updated = await fetch(`http://localhost:4000/api/shifts/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedData = await updated.json();
      setShifts(updatedData);

    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  // ✅ DELETE SHIFT HANDLER
  const handleDeleteShift = async (shiftId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this shift?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:4000/api/shifts/${shiftId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // ✅ Remove from UI
      setShifts((prev) => prev.filter((s) => s.id !== shiftId));

    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <p>Loading shifts...</p>;

  return (
    <div className="container">
      <h2>Shifts for Event #{eventId}</h2>

      {/* ✅ Back Button */}
      <Link to={`/events/${eventId}`} className="back-button">
        ← Back to Event
      </Link>

      {/* ✅ Create Shift (Admin + TeamLead only) */}
      {["Admin", "TeamLead"].includes(userRole) && (
        <Link to={`/events/${eventId}/shifts/new`} className="create-shift-button">
          ➕ Create Shift
        </Link>
      )}

      {shifts.length === 0 ? (
        <p>No shifts found.</p>
      ) : (
        <div className="shift-grid">
          {shifts.map((shift) => (
            <div key={shift.id} className="shift-card-wrapper">
              <ShiftCard shift={shift} />

              {/* ✅ SIGN UP BUTTON (Volunteer only) */}
              {userRole === "Volunteer" && (
                <button
                  onClick={() => handleSignup(shift.id)}
                  style={{
                    backgroundColor: "purple",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    cursor: "pointer",
                    marginTop: "8px",
                    borderRadius: "4px"
                  }}
                >
                  Sign Up
                </button>
              )}

              {/* ✅ DELETE BUTTON (Admin + TeamLead only) */}
              {["Admin", "TeamLead"].includes(userRole) && (
                <button
                  onClick={() => handleDeleteShift(shift.id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    cursor: "pointer",
                    marginTop: "8px",
                    borderRadius: "4px"
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
