import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx'; 
import VolunteerEvents from './pages/VolunteerEvents.jsx';
import EventShifts from "./pages/EventShifts.jsx";
import CreateShift from "./pages/CreateShift.jsx";
import UpdateShift from "./pages/UpdateShift.jsx";
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },

      // ✅ Events list
      { path: 'events', element: <Events /> },

      // ✅ SINGLE EVENT PAGE (you were missing this!)
      { path: 'events/:eventId', element: <EventShifts /> },

      // ✅ Shift routes
      { path: 'events/:eventId/shifts', element: <EventShifts /> },
      { path: 'events/:eventId/shifts/new', element: <CreateShift /> },
      { path: 'events/:eventId/shifts/:shiftId/edit', element: <UpdateShift /> },

      // ✅ Auth
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> }, 

      // ✅ Volunteer event view
      { path: 'volunteer', element: <VolunteerEvents /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
