import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page-center">
      <h1>Welcome to ChurchLink</h1>

      <div className="card-grid" style={{ marginTop: "40px", width: "100%", maxWidth: "800px" }}>
        <Link to="/" className="card">
          <h2>Home</h2>
        </Link>

        <Link to="/events" className="card">
          <h2>Events</h2>
        </Link>

        <Link to="/volunteer" className="card">
          <h2>Volunteer</h2>
        </Link>
      </div>

      {/* ✅ Pill-shaped Login button */}
      <div style={{ marginTop: "30px" }}>
        <Link
          to="/login"
          style={{
            padding: "10px 26px",
            background: "#fff",
            color: "#1D202F",
            borderRadius: "50px",
            fontWeight: "600",
            textDecoration: "none",
            fontSize: "1rem",
            display: "inline-block",
            transition: "0.2s",
          }}
        >
          Login
        </Link>
          {/* ✅ Calendar button (temporary external link) */}
        <div style={{ marginTop: "15px" }}>
          <a
            href="http://localhost:4000/calendar.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "10px 26px",
              background: "#fff",
              color: "#1D202F",
              borderRadius: "50px",
              fontWeight: "600",
              textDecoration: "none",
              fontSize: "1rem",
              display: "inline-block",
              transition: "0.2s",
            }}
          >
            Calendar
          </a>
        </div>
      </div>
    </div>
  );
}
