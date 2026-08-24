const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// =========================
// PostgreSQL Connection
// =========================

pool.on("connect", () => {
  console.log("PostgreSQL database connected.");
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

// =========================
// Database Initialization
// =========================

const initializeDatabase = async () => {
  try {
    // =========================
    // Admins Table
    // =========================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'Administrator',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // =========================
    // Users Table
    // =========================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // =========================
    // Admin Settings Table
    // =========================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        id INTEGER PRIMARY KEY,
        email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
        user_notifications BOOLEAN NOT NULL DEFAULT TRUE,
        maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
        compact_mode BOOLEAN NOT NULL DEFAULT FALSE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // =========================
    // Default Settings
    // =========================

    await pool.query(`
      INSERT INTO admin_settings (
        id,
        email_notifications,
        user_notifications,
        maintenance_mode,
        compact_mode
      )
      VALUES (1, TRUE, TRUE, FALSE, FALSE)
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log("Database tables initialized.");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};

initializeDatabase();

module.exports = pool;
