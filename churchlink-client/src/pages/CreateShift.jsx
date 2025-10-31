import { useState } from "react";
import { useParams } from "react-router-dom";
import { apiPost } from "../api";

export default function CreateShift() {
  const { eventId } = useParams();

  const [form, setForm] = useState({
    shift_name: "",
    start_time: "",
    end_time: "",
    max_volunteers: 1,
    team_id: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await apiPost("/api/shifts", {
        event_id: eventId,
        ...form,
        team_id: form.team_id || null
      });

      if (res.message === "Shift created successfully") {
        setMessage("✅ Shift created successfully!");
      } else {
        setMessage("❌ Error creating shift.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Shift for Event #{eventId}</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}
      >
        <label>Shift Name</label>
        <input
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

        <label>Team ID (optional)</label>
        <input
          type="number"
          name="team_id"
          value={form.team_id}
          onChange={handleChange}
        />

        <button type="submit" style={{ marginTop: "15px" }}>
          Create Shift
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
