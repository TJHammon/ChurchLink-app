// src/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db");
const { generateAccessToken } = require("../authUtils");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "Volunteer" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)";
    await pool.query(sql, [name, email, password_hash, role]);

    return res.status(201).json({ message: "User registered" });
  } catch (err) {
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already registered" });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateAccessToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Protected route
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, role: ${req.user.role}` });
});

// Admin-only route
router.get("/admin", authenticateToken, authorizeRoles("Admin"), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.email}` });
});

// Team Lead + Admin route
router.get(
  "/team",
  authenticateToken,
  authorizeRoles("Admin", "TeamLead"),
  (req, res) => {
    res.json({ message: `Welcome Team Lead or Admin: ${req.user.email}` });
  }
);

module.exports = router;
