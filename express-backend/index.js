//file: index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const helmet = require("helmet");

const { ensureUsersTableExists } = require("./db/init");
const { connectRedis } = require("./config/redisClient");
require("./config/passport-google");

const authRoutes = require("./routes/auth.routes");
const googleAuthRoutes = require("./routes/google-auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

const {
  issueCsrfCookie,
  requireCsrf,
  checkOrigin,
} = require("./middlewares/csrf");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// --- CORS setup ---
const corsOptions = {
  // origin: process.env.FRONTEND_ORIGIN || "http://localhost:4200",
  origin: true, //temporary fix for postman testing, remove it later
  credentials: true,
};
app.use(cors(corsOptions));

// --- Core middlewares ---
// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://lh3.googleusercontent.com"],
        connectSrc: [
          "'self'",
          process.env.FRONTEND_ORIGIN || "http://localhost:4200",
        ],
        frameSrc: ["'self'", "https://accounts.google.com"], // needed for Google login popup
        objectSrc: ["'none'"], // forbid Flash, etc.
        upgradeInsecureRequests: [], // auto-upgrade http→https in production
      },
    },
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// --- CSRF setup ---
// 1) Always issue CSRF cookie if missing
app.use(issueCsrfCookie);

// --- Routes ---
// Auth endpoints do NOT require CSRF (login/register/logout)
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);

// All other routes enforce CSRF
app.use(checkOrigin, requireCsrf);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// --- Start server ---
ensureUsersTableExists()
  .then(() => {
    console.log("Database ready.");
    return connectRedis();
  })
  .then(() => {
    console.log("Redis connected.");
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    if (err.message.includes("Redis")) {
      console.error("Redis connection failed:", err);
    } else {
      console.error("Failed to initialize database:", err);
    }
    process.exit(1);
  });
