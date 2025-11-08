ChurchLink – Volunteer & Event Management App

A full-stack ministry management system for events, shifts, and volunteer coordination.

ChurchLink is a full-stack web application designed to help churches streamline event organization, volunteer scheduling, and ministry communication. Built as a capstone project, it demonstrates real-world development skills: modern React UI, secure Node/Express backend, RESTful APIs, JWT authentication, and a structured MySQL database.

✅ Features
User Roles:
Admin:
Create, edit, and delete events
Create and manage shifts
View and manage volunteer signups
Track attendance (planned enhancement)

Volunteer:
Browse events
View open shifts
Sign up via a confirmation popup
Track commitments

✅ Core Functionality
Home Page:
Three feature cards (Calendar, Events, Get Involved)
Image-based backgrounds with dark overlay and hover reveal effect
Completely responsive layout

Calendar:
React Calendar integration
Highlighted event dates
Dark mode and mobile-friendly layout

Events:
Image-based event cards with text overlay
Displays event title and formatted date
Responsive 2–3 column grid
Clicking opens the Event Shifts page

Event Shifts:
Modern shift cards showing time, capacity, and signups
Volunteers click a card to open a signup confirmation popup
Admins have Edit/Delete buttons
Fully mobile-responsive (full-width cards on mobile)

Get Involved:
Contact form for new volunteers
Styled to match Login/Create Event pages
Future-ready for CRM integration

Tech Stack
Frontend:
React (Vite)
React Router
Custom CSS
Fetch API
Responsive design with custom breakpoints

Backend:
Node.js
Express.js
RESTful API architecture
JWT authentication
Role-based middleware

Database:
MySQL, including tables for:
users
events
teams
shifts
shift_signups

Key Features Delivered
✔ Full CRUD operations
✔ Authentication with JWT
✔ Role-based access control
✔ Volunteer shift sign-up system
✔ Popup confirmation workflow
✔ Image-based event cards
✔ Fully responsive UI
✔ GitHub version control
✔ Agile workflow (Trello)

Local Setup (Run This Project Locally)
1. Clone the repository
git clone https://github.com/TJHammon/ChurchLink-app.git
cd ChurchLink-app

2. Install client dependencies
cd churchlink-client
npm install


Run the client:
npm run dev

3. Install server dependencies
cd ../churchlink-server
npm install


Create a .env file:
PORT=4000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=churchlink
JWT_SECRET=your_secret_here


Run the server:
node src/index.js

Screenshots:

Future Enhancements:
Attendance analytics dashboard
Event filtering by team/date
Improved UI polish & theming
Full accessibility pass
Deployment to Render/Vercel/PlanetScale

Author:
TJ Hammon
Full-Stack Developer
GitHub: https://github.com/TJHammon
