import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";

export default function App() {
  return (
    <div className="app">
      {/* ✅ White Nav Bar */}
      <NavBar />

      {/* ✅ Main Content Area */}
      <main className="container" style={{ paddingTop: "80px" }}>
        <Outlet />
      </main>
    </div>
  );
}
