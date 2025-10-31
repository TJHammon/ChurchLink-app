ChurchLink – Volunteer & Event Management App

ChurchLink is a full-stack web application designed to help churches and ministries manage events, volunteer scheduling, attendance, and administrative workflows. Built as a capstone project, it demonstrates modern front-end development, secure back-end architecture, RESTful API design, and database interaction.

Features
User Roles:
Admin – Full access: create events, create shifts, approve/deny signups, attendance tracking.
Team Lead – Manage shifts for their teams, approve signups, track attendance.
Volunteer – View events, sign up for shifts, track commitments.

Core Functionality
Events:
Create and manage events
Event detail pages
View shifts per event

Shifts:
Create, update, and delete shifts
Capacity limits
Track signups
Assign volunteers

Volunteer Signups:
Volunteers can sign up for open shifts
Prevent duplicate or over-capacity signups
Admin/Lead can approve/cancel signups
Attendance Tracking (in progress)
Lead/Admin check-in
Optional self-check-in workflow

Tech Stack
Frontend:
React (Vite)
React Router
CSS Modules / Custom Styling
Fetch API

Backend:
Node.js
Express.js
RESTful API architecture
Authentication & Authorization (JWT)
Role-based routes

Database:
MySQL
Tables include:
users
events
teams
shifts
shift_signups

Project Requirements Met
✔ React front-end
✔ Node + Express back-end
✔ SQL database
✔ Full CRUD operations
✔ User authentication (JWT)
✔ Role-based access
✔ Fully responsive styling (in progress)
✔ GitHub version control
✔ Agile workflow (Trello board)

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
