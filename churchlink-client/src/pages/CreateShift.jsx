import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiPost } from "../api";

export default function CreateShift() {
  const { eventId } = useParams();

  const [eventInfo, setEventInfo] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    shift_name: "",
    start_time: "",
    end_time: "",
    max_volunteers: 1,
    team_id: ""
  });

  // ✅ Fetch event title
  useEffect(() => {
    fetch(`http://localhost:4000/api/events/${eventId}`)
      .then(res => res.json())
      .then(data => setEventInfo(data))
      .catch(err => console.error("Error fetching event:", err));
  }, [eventId]);

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
    <div className="page-center" style={{ paddingTop: "100px" }}>
      {/* ✅ Centered headline with real event title */}
      <h2 style={{ marginBottom: "20px" }}>
        Create Shift for{" "}
        <span style={{ color: "#44c1f1" }}>
          {eventInfo?.title || `Event #${eventId}`}
        </span>
      </h2>

      <form
        onSubmit={handleSubmit}
        className="shift-form"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "400px",
          textAlign: "left"
        }}
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

        <label>Team ID (Optional)</label>
        <input
          type="number"
          name="team_id"
          value={form.team_id}
          onChange={handleChange}
        />

        <button type="submit" style={{ marginTop: "20px" }}>
          Create Shift
        </button>
      </form>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
}
