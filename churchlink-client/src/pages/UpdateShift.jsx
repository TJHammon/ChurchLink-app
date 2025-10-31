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
    team_id: null
  });

  const [loading, setLoading] = useState(true);

  // ✅ Converts MySQL/ISO → datetime-local format
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
          team_id: data.team_id || null
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

  // ✅ Before sending to server: convert datetime-local → MySQL datetime
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
      team_id: form.team_id
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

  if (loading) return <p>Loading shift...</p>;

  return (
    <div className="container">
      <h2>Edit Shift</h2>

      <form onSubmit={handleSubmit} className="shift-form">

        <label>Shift Name</label>
        <input
          type="text"
          name="shift_name"
          value={form.shift_name}
          onChange={handleChange}
          required
        />

        <label>Start Time</label>
        <input
          type="datetime-local"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          required
        />

        <label>End Time</label>
        <input
          type="datetime-local"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          required
        />

        <label>Max Volunteers</label>
        <input
          type="number"
          name="max_volunteers"
          min="1"
          value={form.max_volunteers}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Shift</button>
      </form>
    </div>
  );
}
