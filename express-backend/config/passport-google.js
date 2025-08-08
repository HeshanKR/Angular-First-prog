const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("../db/db"); // your db connection

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        // Check if user exists
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
          email,
        ]);

        let user;
        if (rows.length > 0) {
          user = rows[0];
        } else {
          const [result] = await pool.query(
            "INSERT INTO users (name, email, role, password) VALUES (?, ?, 'user', '')",
            [name, email]
          );
          const [newUserRows] = await pool.query(
            "SELECT * FROM users WHERE id = ?",
            [result.insertId]
          );
          user = newUserRows[0];
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
