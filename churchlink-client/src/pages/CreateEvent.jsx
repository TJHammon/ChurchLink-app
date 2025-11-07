import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // ✅ Reuse Login form styling

export default function CreateEvent() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [event_date, setEventDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, event_date }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Event created successfully!");
        setTimeout(() => navigate("/events"), 700);
      } else {
        setMessage(data.message || "Failed to create event");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h1>Create Event</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="datetime-local"
          value={event_date}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />

        <button type="submit" className="auth-btn">
          Create Event
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
}
