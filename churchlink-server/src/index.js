const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const authRoutes = require("./routes/auth.js");
const teamRoutes = require("./routes/teamRoutes.js");
const eventRoutes = require("./routes/eventRoutes.js");
const shiftRoutes = require("./routes/shiftRoutes.js");

app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/shifts", shiftRoutes);

app.get("/db-test", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() as now");
    res.json({ dbConnected: true, time: rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ dbConnected: false, error: err.message });
  }
});

// Health checks
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/api/health", (_req, res) => res.json({ ok: true, api: "v1" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});