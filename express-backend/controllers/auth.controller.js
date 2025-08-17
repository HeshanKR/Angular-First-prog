// express-backend/controllers/auth.controller.js
const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const xss = require("xss");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

// --- Helpers ---
const generateRefreshToken = () => crypto.randomBytes(40).toString("hex");

const storeRefreshToken = async (userId, token, ip, userAgent) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await db.query(
    "INSERT INTO refresh_tokens (user_id, token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)",
    [userId, token, ip, userAgent, expiresAt]
  );
  return expiresAt;
};

// --- Register ---
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const name = xss(req.body.name);
  const email = xss(req.body.email);
  const password = req.body.password;

  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0)
      return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- Login ---
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const email = xss(req.body.email);
  const password = req.body.password;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // --- Generate access token ---
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // --- Generate refresh token ---
    const ip = req.ip;
    const userAgent = req.get("User-Agent") || "unknown";
    const refreshToken = generateRefreshToken();
    await storeRefreshToken(user.id, refreshToken, ip, userAgent);

    const ONE_QUARTER_HOUR = 1000 * 60 * 15;

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ONE_QUARTER_HOUR,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- Refresh Access Token ---
const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  try {
    const [rows] = await db.query(
      "SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()",
      [refreshToken]
    );
    const tokenRow = rows[0];
    if (!tokenRow)
      return res.status(403).json({ message: "Invalid refresh token" });

    const ip = req.ip;
    const userAgent = req.get("User-Agent") || "unknown";
    if (tokenRow.ip_address !== ip || tokenRow.user_agent !== userAgent)
      return res.status(403).json({ message: "Token source mismatch" });

    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [
      tokenRow.user_id,
    ]);
    const user = users[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res
      .cookie("token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .json({ message: "Access token refreshed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// --- Logout ---
const tokenBlacklist = new Set();

const logoutUser = async (req, res) => {
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (token) tokenBlacklist.add(token);
  if (refreshToken) {
    await db.query("DELETE FROM refresh_tokens WHERE token = ?", [
      refreshToken,
    ]);
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({ message: "Logged out successfully" });
};

const isTokenBlacklisted = (token) => tokenBlacklist.has(token);

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  isTokenBlacklisted,
};

// //file: auth.controller.js
// const db = require("../db/db");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const xss = require("xss");

// const { validationResult } = require("express-validator");

// const registerUser = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty())
//     return res.status(400).json({ errors: errors.array() });

//   // sanitize inputs
//   const name = xss(req.body.name);
//   const email = xss(req.body.email);
//   const password = req.body.password; // don't sanitize password, hashing will handle it

//   try {
//     // check if email already exists
//     const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
//       email,
//     ]);
//     if (existing.length > 0) {
//       return res.status(409).json({ message: "Email already registered" });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // insert user
//     await db.query(
//       "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
//       [name, email, hashedPassword]
//     );

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const loginUser = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty())
//     return res.status(400).json({ errors: errors.array() });

//   const email = xss(req.body.email);
//   const password = req.body.password;

//   try {
//     const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
//       email,
//     ]);
//     const user = users[0];

//     if (!user) return res.status(401).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user.id, role: user.role, name: user.name, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     const ONE_HOUR = 1000 * 60 * 60;

//     res
//       .cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production", // true in production
//         sameSite: "lax",
//         maxAge: ONE_HOUR,
//       })
//       .json({ message: "Login successful" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const tokenBlacklist = new Set();

// const logoutUser = (req, res) => {
//   const token = req.cookies.token;
//   if (token) {
//     tokenBlacklist.add(token);
//   }
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//   });
//   res.json({ message: "Logged out successfully" });
// };

// const isTokenBlacklisted = (token) => tokenBlacklist.has(token);

// module.exports = {
//   registerUser,
//   loginUser,
//   logoutUser,
//   isTokenBlacklisted,
// };
