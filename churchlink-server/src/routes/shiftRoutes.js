const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ CREATE SHIFT (Admin or TeamLead)
router.post("/", authenticateToken, authorizeRoles("Admin", "TeamLead"), async (req, res) => {
  try {
    const { event_id, team_id, shift_name, start_time, end_time, max_volunteers } = req.body;

    if (!event_id || !shift_name || !start_time || !end_time) {
      return res.status(400).json({ message: "event_id, shift_name, start_time, and end_time are required" });
    }

    const sql = `
      INSERT INTO shifts (event_id, team_id, shift_name, start_time, end_time, max_volunteers)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      event_id,
      team_id || null,
      shift_name,
      start_time,
      end_time,
      max_volunteers || 1
    ]);

    res.status(201).json({ message: "Shift created successfully" });

  } catch (err) {
    console.error("Error creating shift:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET all shifts for a specific event (Admin, TeamLead, Volunteer)
router.get(
  "/event/:eventId",
  authenticateToken,
  authorizeRoles("Admin", "TeamLead", "Volunteer"),
  async (req, res) => {
    try {
      const { eventId } = req.params;

      // Return shifts with team name and current signup counts
      const [rows] = await pool.query(
        `
        SELECT 
          s.id,
          s.event_id,
          s.team_id,
          t.name AS team_name,
          s.shift_name,
          s.start_time,
          s.end_time,
          s.max_volunteers,
          COALESCE(si.signup_count, 0) AS signup_count
        FROM shifts s
        LEFT JOIN teams t ON s.team_id = t.id
        LEFT JOIN (
          SELECT shift_id, COUNT(*) AS signup_count
          FROM shift_signups
          GROUP BY shift_id
        ) si ON si.shift_id = s.id
        WHERE s.event_id = ?
        ORDER BY s.start_time ASC;
        `,
        [eventId]
      );

      res.json(rows);
    } catch (err) {
      console.error("Error fetching shifts:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ✅ GET SINGLE SHIFT BY ID (needed for edit page)
router.get(
  "/event/:eventId",
  authenticateToken,
  authorizeRoles("Admin", "TeamLead", "Volunteer"),
  async (req, res) => {
    console.log("✅ Shift route hit for event:", req.params.eventId);
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT 
          s.*,
          t.name AS team_name
       FROM shifts s
       LEFT JOIN teams t ON s.team_id = t.id
       WHERE s.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Shift not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching shift:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE SHIFT
router.put("/:id", authenticateToken, authorizeRoles("Admin", "TeamLead"), async (req, res) => {
  try {
    const { id } = req.params;
    const { shift_name, start_time, end_time, max_volunteers, team_id } = req.body;

    const sql = `
      UPDATE shifts
      SET shift_name = ?, start_time = ?, end_time = ?, max_volunteers = ?, team_id = ?
      WHERE id = ?
    `;

    await pool.query(sql, [
      shift_name,
      start_time,
      end_time,
      max_volunteers,
      team_id || null,
      id
    ]);

    res.json({ message: "Shift updated successfully" });
  } catch (err) {
    console.error("Error updating shift:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE SHIFT (Admin or TeamLead)
router.delete("/:id", authenticateToken, authorizeRoles("Admin", "TeamLead"), async (req, res) => {
  try {
    const { id } = req.params;

    // Delete signups for this shift (FK constraint safety)
    await pool.query("DELETE FROM shift_signups WHERE shift_id = ?", [id]);

    // Delete the shift
    const [result] = await pool.query("DELETE FROM shifts WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Shift not found" });
    }

    res.json({ message: "Shift deleted successfully" });
  } catch (err) {
    console.error("Error deleting shift:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ VOLUNTEER SIGNUP FOR A SHIFT
router.post("/:shiftId/signup", authenticateToken, authorizeRoles("Admin", "TeamLead", "Volunteer"), async (req, res) => {
  try {
    const { shiftId } = req.params;
    const userId = req.user.id;

    // ✅ 1. Get shift info including capacity
    const [[shift]] = await pool.query(
      `SELECT id, max_volunteers FROM shifts WHERE id = ?`,
      [shiftId]
    );

    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    // ✅ 2. Count current signups
    const [[count]] = await pool.query(
      `SELECT COUNT(*) AS signup_count FROM shift_signups WHERE shift_id = ?`,
      [shiftId]
    );

    if (count.signup_count >= shift.max_volunteers) {
      return res.status(400).json({ message: "Shift is full" });
    }

    // ✅ 3. Prevent duplicate signups
    const [[existing]] = await pool.query(
      `SELECT * FROM shift_signups WHERE shift_id = ? AND user_id = ?`,
      [shiftId, userId]
    );

    if (existing) {
      return res.status(400).json({ message: "You are already signed up for this shift" });
    }

    // ✅ 4. Insert signup with default "pending" status
    await pool.query(
      `INSERT INTO shift_signups (shift_id, user_id, status) VALUES (?, ?, 'pending')`,
      [shiftId, userId]
    );

    res.json({ message: "Signup successful" });

  } catch (err) {
    console.error("Error signing up:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
