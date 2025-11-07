import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page-center" style={{ paddingTop: "80px" }}>
      <h1 style={{ marginBottom: "40px" }}>Welcome to ChurchLink</h1>

      {/* Card Grid */}
      <div
        className="card-grid"
        style={{
          marginTop: "40px",
          width: "100%",
          maxWidth: "1000px"
        }}
      >
        {/* ✅ Calendar card (replaces Home card) */}
        <Link to="/calendar" className="card">
          <h2>Calendar</h2>
        </Link>

        <Link to="/events" className="card">
          <h2>Events</h2>
        </Link>

        <Link to="/volunteer" className="card">
          <h2>Volunteer</h2>
        </Link>
      </div>
    </div>
  );
}
