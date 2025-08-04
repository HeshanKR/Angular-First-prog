// file: db/init.js
const db = require("./db");

async function ensureUsersTableExists() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await db.query(createTableSQL);
    console.log("✅ 'users' table verified or created.");
  } catch (err) {
    console.error("❌ Failed to ensure 'users' table exists:", err);
  }
}

module.exports = {
  ensureUsersTableExists,
};
