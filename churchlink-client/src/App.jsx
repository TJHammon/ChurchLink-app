import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";

export default function App() {
  return (
    <div className="app">
      {/* ✅ New White Nav Bar */}
      <NavBar />

      {/* ✅ Add padding so content is not under the bar */}
      <main className="container" style={{ paddingTop: "80px" }}>
        <Outlet />
      </main>
    </div>
  );
}