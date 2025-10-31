// --- Helper functions for managing JWT token ---
function getToken() {
  return localStorage.getItem("jwtToken") || "";
}

function setTokenInteractive() {
  const existing = getToken();
  const entered = prompt(
    "Paste your JWT (starts with ey...)\n\nExisting value will be replaced:",
    existing
  );
  if (entered && entered.trim().length > 0) {
    localStorage.setItem("jwtToken", entered.trim());
    alert("Token saved. Reloading events...");
    location.reload();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const calendarEl = document.getElementById("calendar");
  document
    .getElementById("setTokenBtn")
    .addEventListener("click", setTokenInteractive);

  // Initialize FullCalendar
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,listWeek",
    },
    events: async (fetchInfo, successCallback, failureCallback) => {
      try {
        const token = getToken();
        if (!token) {
          return failureCallback(
            new Error("No token set. Click 'Set Token' and paste your JWT.")
          );
        }

        const response = await fetch(
          "http://localhost:4000/api/events/volunteer",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();

        const events = data.map((event) => ({
          title: event.title,
          start: event.event_date,
          description: event.description,
          extendedProps: {
            team: event.team_name,
          },
        }));

        successCallback(events);
      } catch (err) {
        console.error("Error loading events:", err);
        failureCallback(err);
      }
    },
    eventClick: function (info) {
      alert(
        `📅 ${info.event.title}\n\nTeam: ${info.event.extendedProps.team}\n\n${info.event.extendedProps.description}`
      );
    },
  });

  calendar.render();
});
