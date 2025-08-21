// file: express-backend/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const helmet = require("helmet");

const {
  ensureUsersTableExists,
  ensureRefreshTokensTableExists,
} = require("./db/init");
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
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:4200",
  credentials: true,
};
app.use(cors(corsOptions));

// --- Core middlewares ---
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
        frameSrc: ["'self'", "https://accounts.google.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// --- CSRF setup ---
app.use(issueCsrfCookie);

// --- API routes ---
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use(checkOrigin, requireCsrf);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// --- Start server ---
ensureUsersTableExists()
  .then(() => ensureRefreshTokensTableExists())
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
