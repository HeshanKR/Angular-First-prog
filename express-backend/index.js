//file: index.jsno
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { ensureUsersTableExists } = require("./db/init");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ensure the users table exists before starting the server
ensureUsersTableExists()
  .then(() => {
    // Mount routes only after DB setup is complete
    app.use("/api/auth", authRoutes);
    app.use("/api/user", userRoutes);
    app.use("/api/admin", adminRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1); // Exit the app if the DB setup fails
  });
