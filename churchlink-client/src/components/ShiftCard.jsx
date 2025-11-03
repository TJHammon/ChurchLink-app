import { Link, useParams } from "react-router-dom";

export default function ShiftCard({ shift }) {
  const { eventId } = useParams();
  const userRole = localStorage.getItem("role");

  return (
    <div
      className="shift-card"
      style={{
        background: "var(--card-dark)",
        padding: "24px",
        borderRadius: "14px",
        color: "var(--text-light)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        textAlign: "left",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "10px", fontSize: "1.3rem" }}>
        {shift.shift_name}
      </h3>

      <p style={{ margin: "6px 0", opacity: 0.9 }}>
        <strong>Time:</strong><br />
        {new Date(shift.start_time).toLocaleString()}<br />
        → {new Date(shift.end_time).toLocaleString()}
      </p>

      <p style={{ margin: "6px 0", opacity: 0.9 }}>
        <strong>Volunteers:</strong> {shift.signup_count}/{shift.max_volunteers}
      </p>

      {/* ✅ Edit button (Admin + TeamLead) */}
      {["Admin", "TeamLead"].includes(userRole) && (
        <Link
          to={`/events/${eventId}/shifts/${shift.id}/edit`}
          style={{
            display: "inline-block",
            marginTop: "12px",
            padding: "6px 12px",
            background: "#44c1f1",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          Edit Shift
        </Link>
      )}
    </div>
  );
}
