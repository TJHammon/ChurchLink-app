import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav
      style={{
        width: "100%",
        background: "#ffffff",
        padding: "8px 30px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "#1D202F",
          fontSize: "1.0rem",
          fontWeight: "700",
          fontFamily: "Open Sans, sans-serif",
        }}
      >
        ChurchLink
      </Link>
    </nav>
  );
}
