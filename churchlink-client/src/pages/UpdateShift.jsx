import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateShift() {
  const { eventId, shiftId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shift_name: "",
    start_time: "",
    end_time: "",
    max_volunteers: 1,
  });

  const [loading, setLoading] = useState(true);

  // ✅ Convert MySQL → datetime-local
  function toLocalInputValue(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  // ✅ Load existing shift
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:4000/api/shifts/${shiftId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setForm({
          shift_name: data.shift_name || "",
          start_time: toLocalInputValue(data.start_time),
          end_time: toLocalInputValue(data.end_time),
          max_volunteers: data.max_volunteers || 1,
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading shift:", err);
        setLoading(false);
      });
  }, [shiftId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Convert datetime-local → MySQL format
  function toMySQLDate(value) {
    return new Date(value).toISOString().slice(0, 19).replace("T", " ");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      shift_name: form.shift_name,
      start_time: toMySQLDate(form.start_time),
      end_time: toMySQLDate(form.end_time),
      max_volunteers: form.max_volunteers,
    };

    const res = await fetch(`http://localhost:4000/api/shifts/${shiftId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert("Shift updated!");
      navigate(`/events/${eventId}/shifts`);
    } else {
      alert("Failed to update.");
    }
  };

  if (loading) return <p style={{ marginTop: "80px" }}>Loading shift...</p>;

  return (
    <div
      className="page-center"
      style={{ paddingTop: "100px", paddingBottom: "40px" }}
    >
      <h2 style={{ marginBottom: "20px" }}>Edit Shift</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#475067",
          padding: "30px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "450px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          textAlign: "left",
          color: "white",
        }}
      >
        {/* SHIFT NAME */}
        <label style={{ fontWeight: "600" }}>Shift Name</label>
        <input
          type="text"
          name="shift_name"
          value={form.shift_name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* START TIME */}
        <label style={{ fontWeight: "600" }}>Start Time</label>
        <input
          type="datetime-local"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* END TIME */}
        <label style={{ fontWeight: "600" }}>End Time</label>
        <input
          type="datetime-local"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* MAX VOLUNTEERS */}
        <label style={{ fontWeight: "600" }}>Max Volunteers</label>
        <input
          type="number"
          name="max_volunteers"
          min="1"
          value={form.max_volunteers}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            background: "#44c1f1",
            border: "none",
            borderRadius: "6px",
            color: "#1D202F",
            fontSize: "1rem",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Update Shift
        </button>
      </form>
    </div>
  );
}

// ✅ Shared input style
const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0 16px 0",
  borderRadius: "6px",
  border: "none",
  fontSize: "1rem",
};
