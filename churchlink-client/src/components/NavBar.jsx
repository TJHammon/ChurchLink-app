import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav
  style={{
    width: "100%",
    background: "#ffffff",
    padding: "16px 30px",     // increased vertical padding
    height: "60px",           // fixed navbar height for consistent layout
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>
      {/* Left side: Home link */}
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

      {/* Right side: Login Link */}
      <Link
        to="/login"
        style={{
          textDecoration: "none",
          color: "#1D202F",
          fontSize: "1.1rem",
          fontWeight: "600",
          fontFamily: "Open Sans, sans-serif",
        }}
      >
        Login
      </Link>
    </nav>
  );
}
