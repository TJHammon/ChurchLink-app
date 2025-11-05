const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// CREATE event (Admin/TeamLead)
router.post("/", authenticateToken, authorizeRoles("Admin", "TeamLead"), async (req, res) => {
  try {
    const { title, description, event_date, team_id } = req.body;
    const created_by = req.user.id;

    if (!title || !event_date) {
      return res.status(400).json({ message: "Title and event_date are required" });
    }

    const sql = `
      INSERT INTO events (title, description, event_date, team_id, created_by)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [title, description, event_date, team_id, created_by]);

    res.status(201).json({ message: "Event created successfully" });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// READ all events (TEMPORARY — for testing)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.id, e.title, e.description, e.event_date,
             t.name AS team_name, u.name AS created_by, e.created_at
      FROM events e
      LEFT JOIN teams t ON e.team_id = t.id
      JOIN users u ON e.created_by = u.id
      ORDER BY e.event_date ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get a single event by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT id, title, description, event_date 
       FROM events 
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE event (Admin/TeamLead)
router.put("/:id", authenticateToken, authorizeRoles("Admin", "TeamLead"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, event_date, team_id } = req.body;

    const sql = `
      UPDATE events
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          event_date = COALESCE(?, event_date),
          team_id = COALESCE(?, team_id)
      WHERE id = ?
    `;
    const [result] = await pool.query(sql, [title, description, event_date, team_id, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event updated successfully" });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE event (Admin only)
router.delete("/:id", authenticateToken, authorizeRoles("Admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM events WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/events/volunteer - View all upcoming events (Volunteer access)
router.get("/volunteer", authenticateToken, authorizeRoles("Admin", "TeamLead", "Volunteer"), async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.id, 
        e.title, 
        e.description, 
        e.event_date, 
        t.name AS team_name
      FROM events e
      LEFT JOIN teams t ON e.team_id = t.id
      WHERE e.event_date >= NOW()
      ORDER BY e.event_date ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
