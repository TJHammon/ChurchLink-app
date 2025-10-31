const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// CREATE team (Admin/TeamLead)
router.post("/", authenticateToken, authorizeRoles("Admin", "TeamLead"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const created_by = req.user.id;

    if (!name) return res.status(400).json({ message: "Team name is required" });

    const sql = "INSERT INTO teams (name, description, created_by) VALUES (?, ?, ?)";
    await pool.query(sql, [name, description, created_by]);

    res.status(201).json({ message: "Team created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/teams
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.name, t.description, u.name AS created_by, t.created_at
      FROM teams t
      JOIN users u ON t.created_by = u.id
      ORDER BY t.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/teams/:id
router.put("/:id", authenticateToken, authorizeRoles("Admin", "TeamLead"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    if (!name && !description) {
      return res.status(400).json({ message: "At least one field (name or description) is required" });
    }

    const [result] = await pool.query(
      "UPDATE teams SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?",
      [name, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json({ message: "Team updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// READ all teams
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM teams ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE team (Admin/TeamLead)
router.put("/:id", authenticateToken, authorizeRoles("Admin", "TeamLead"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const sql = "UPDATE teams SET name = ?, description = ? WHERE id = ?";
    const [result] = await pool.query(sql, [name, description, id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Team not found" });

    res.json({ message: "Team updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE team (Admin only)
router.delete("/:id", authenticateToken, authorizeRoles("Admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM teams WHERE id = ?", [id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Team not found" });

    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
