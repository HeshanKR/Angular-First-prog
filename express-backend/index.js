//file: index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { ensureUsersTableExists } = require("./db/init");
const passport = require("passport");
require("./config/passport-google");
const { connectRedis } = require("./config/redisClient");

const authRoutes = require("./routes/auth.routes");
const googleAuthRoutes = require("./routes/google-auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:4200", // frontend URL here
  credentials: true, // allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Ensure the users table exists before starting the server
ensureUsersTableExists()
  .then(() => {
    console.log("Database ready.");
    return connectRedis();
  })
  .then(() => {
    console.log("Redis connected.");
    // Mount routes only after DB setup is complete
    app.use("/api/auth", authRoutes);
    app.use("/api/auth", googleAuthRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/admin", adminRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    if (err.message.includes("Redis")) {
      console.error("Redis connection failed:", err);
    } else {
      console.error("Failed to initialize database:", err);
    }
    process.exit(1); // Exit the app if the DB setup fails
  });
