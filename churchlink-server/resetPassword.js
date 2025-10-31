const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

(async () => {
  const pool = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Password1!",   // ✅ your actual MySQL root password
    database: "churchlink",
  });

  const newPassword = "Password1!";  // ✅ this will be the new login password

  const hashed = await bcrypt.hash(newPassword, 10);

await pool.query(
  "UPDATE users SET password_hash = ? WHERE email = ?",
  [hashed, "admin2@example.com"]
);

  console.log("✅ Password reset complete. New password is:", newPassword);
  process.exit(0);
})();
