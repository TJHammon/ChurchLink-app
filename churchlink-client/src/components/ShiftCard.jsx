import { Link, useParams } from "react-router-dom";

export default function ShiftCard({ shift, onDelete, onSignup }) {
  const { eventId } = useParams();
  const userRole = localStorage.getItem("role");

  // ✅ Format time only (no date, no seconds)
  const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });
  };

  return (
    <div className="shift-card">
      <h3 className="shift-title">{shift.shift_name}</h3>

      <p className="shift-time">
        <strong>Time:</strong><br />
        {formatTime(shift.start_time)} → {formatTime(shift.end_time)}
      </p>

      <p className="shift-volunteers">
        <strong>Volunteers:</strong> {shift.signup_count}/{shift.max_volunteers}
      </p>

      {/* ✅ ADMIN / TEAM LEAD BUTTONS */}
      {["Admin", "TeamLead"].includes(userRole) && (
        <div className="shift-buttons">
          <Link
            to={`/events/${eventId}/shifts/${shift.id}/edit`}
            className="shift-btn edit-btn"
          >
            Edit
          </Link>

          <button
            className="shift-btn delete-btn"
            onClick={() => onDelete(shift.id)}
          >
            Delete
          </button>
        </div>
      )}

      {/* ✅ VOLUNTEER SIGN UP BUTTON */}
      {userRole === "Volunteer" && (
        <div className="shift-buttons">
          <button
            className="shift-btn"
            onClick={() => onSignup(shift.id)}
            style={{
              background: "#44c1f1",
              color: "#000",
              fontWeight: "700"
            }}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
