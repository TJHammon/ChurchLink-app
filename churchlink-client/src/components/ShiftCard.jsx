import { Link, useParams } from "react-router-dom";

export default function ShiftCard({ shift }) {
  const { eventId } = useParams();
  const userRole = localStorage.getItem("role");

  return (
    <div className="shift-card">
      <h3>{shift.shift_name}</h3>

      <p><strong>Team:</strong> {shift.team_name || "Unassigned"}</p>

      <p>
        <strong>Time:</strong><br />
        {new Date(shift.start_time).toLocaleString()}<br />
        → {new Date(shift.end_time).toLocaleString()}
      </p>

      <p>
        <strong>Volunteers:</strong> {shift.signup_count}/{shift.max_volunteers}
      </p>

      {/* ✅ Edit button visible ONLY for Admin or TeamLead */}
      {["Admin", "TeamLead"].includes(userRole) && (
        <Link
          to={`/events/${eventId}/shifts/${shift.id}/edit`}
          className="edit-shift-button"
        >
          ✏️ Edit Shift
        </Link>
      )}
    </div>
  );
}
