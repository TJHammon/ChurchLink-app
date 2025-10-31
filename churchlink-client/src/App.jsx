import { Outlet, NavLink } from 'react-router-dom';

export default function App() {

  return (
    <div className="app">
      <nav className="nav">
        <div className="brand">ChurchLink</div>
        <div className="links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/volunteer">Volunteer</NavLink>
        </div>
      </nav>

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
