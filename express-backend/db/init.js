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

async function ensureRefreshTokensTableExists() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      token VARCHAR(500) NOT NULL,
      ip_address VARCHAR(45),
      user_agent VARCHAR(255),
      expires_at DATETIME NOT NULL,
      revoked BOOLEAN DEFAULT FALSE,
      rotated_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_token (token)
    )
  `;

  try {
    await db.query(createTableSQL);
    console.log("✅ 'refresh_tokens' table verified or created.");
  } catch (err) {
    console.error("❌ Failed to ensure 'refresh_tokens' table exists:", err);
  }
}

module.exports = {
  ensureUsersTableExists,
  ensureRefreshTokensTableExists,
};

// // file: db/init.js
// const db = require("./db");

// async function ensureUsersTableExists() {
//   const createTableSQL = `
//     CREATE TABLE IF NOT EXISTS users (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       name VARCHAR(255) NOT NULL,
//       email VARCHAR(255) UNIQUE NOT NULL,
//       password VARCHAR(255) NOT NULL,
//       role ENUM('user', 'admin') DEFAULT 'user',
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `;

//   try {
//     await db.query(createTableSQL);
//     console.log("✅ 'users' table verified or created.");
//   } catch (err) {
//     console.error("❌ Failed to ensure 'users' table exists:", err);
//   }
// }

// async function ensureRefreshTokensTableExists() {
//   const createTableSQL = `
//     CREATE TABLE IF NOT EXISTS refresh_tokens (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       user_id INT NOT NULL,
//       token VARCHAR(500) NOT NULL,
//       ip_address VARCHAR(45),
//       user_agent VARCHAR(255),
//       expires_at DATETIME NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
//     )
//   `;
//   try {
//     await db.query(createTableSQL);
//     console.log("✅ 'refresh_tokens' table verified or created.");
//   } catch (err) {
//     console.error("❌ Failed to ensure 'refresh_tokens' table exists:", err);
//   }
// }

// module.exports = {
//   ensureUsersTableExists,
//   ensureRefreshTokensTableExists,
// };
