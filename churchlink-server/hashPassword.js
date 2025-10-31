// resetPassword.js
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

(async () => {
  try {
    const pool = await mysql.createPool({
      host: "localhost",
      user: "root",           
      password: "your_password_here",  // ← CHANGE THIS
      database: "churchlink",
    });

    // ✅ CHANGE THESE TWO VALUES
    const emailToUpdate = "admin2@example.com";  // user to update
    const newPassword = "admin123";              // new password you want

    // ✅ hash the new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // ✅ update the correct column
    await pool.query(
      "UPDATE users SET password_hash = ? WHERE email = ?",
      [hashed, emailToUpdate]
    );

    console.log("✅ Password reset complete!");
    console.log("Updated user:", emailToUpdate);
    console.log("New plain password:", newPassword);
    process.exit(0);

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
