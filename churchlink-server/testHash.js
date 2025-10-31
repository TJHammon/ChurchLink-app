const bcrypt = require("bcrypt");

const storedHash = "$2b$10$7FOhGfT/WyjNn1gXvW0m8u4EzTfCkNSEJb6wCvKMGXxqzLQX8Ai";
const plainPassword = "admin123";

(async () => {
  const result = await bcrypt.compare(plainPassword, storedHash);
  console.log("COMPARE RESULT:", result);
})();
