import { Link, useParams } from "react-router-dom";

export default function ShiftCard({ shift, onDelete }) {
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

      {/* ✅ BUTTON ROW */}
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
    </div>
  );
}
