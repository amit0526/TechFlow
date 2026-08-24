require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./db/database");

const authRoutes = require("./routes/authRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const authMiddleware = require("./middleware/authMiddleware");

const { sendUserNotificationEmail } = require("./services/emailService");

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// =========================
// Middleware
// =========================

const allowedOrigins = [
  "http://localhost:5173",
  "https://techflow-fronted.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // such as health checks/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  }),
);

app.use(express.json());

// =========================
// Auth Routes
// =========================

app.use("/api/auth", authRoutes);

// =========================
// Settings Routes
// =========================

app.use("/api/settings", settingsRoutes);

// =========================
// Helper
// Check Email Notifications
// =========================

async function isEmailNotificationEnabled() {
  try {
    const result = await pool.query(`
      SELECT email_notifications
      FROM admin_settings
      WHERE id = 1
    `);

    return result.rows[0]?.email_notifications ?? false;
  } catch (error) {
    console.error("Failed to check email notification setting:", error);

    return false;
  }
}

// =========================
// Send User Email Safely
// =========================

async function notifyUserAction(action, user) {
  try {
    const enabled = await isEmailNotificationEnabled();

    if (!enabled) {
      console.log(`Email notification skipped: ${action}`);
      return;
    }

    sendUserNotificationEmail({
      action,
      user,
    }).catch((error) => {
      console.error(`Email notification failed for ${action}:`, error);
    });
  } catch (error) {
    console.error(`User notification error (${action}):`, error);
  }
}

// =========================
// Health Check
// GET /
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "TechFlow backend is running 🚀",
  });
});

// =========================
// Database Health Check
// GET /api/health
// =========================

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");

    res.json({
      status: "online",
      database: "connected",
      time: result.rows[0].current_time,
    });
  } catch (error) {
    console.error("Database health check:", error);

    res.status(500).json({
      status: "offline",
      database: "disconnected",
      error: "Database connection failed",
    });
  }
});

// =========================
// Get All Users
// GET /api/users
// Protected
// =========================

app.get("/api/users", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id DESC");

    res.json(result.rows);
  } catch (error) {
    console.error("GET /api/users:", error);

    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
});

// =========================
// Get Single User
// GET /api/users/:id
// Protected
// =========================

app.get("/api/users/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET /api/users/:id:", error);

    res.status(500).json({
      error: "Failed to fetch user",
    });
  }
});

// =========================
// Create User
// POST /api/users
// Protected
// =========================

app.post("/api/users", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `
        INSERT INTO users (name, email)
        VALUES ($1, $2)
        RETURNING *
      `,
      [cleanName, cleanEmail],
    );

    const user = result.rows[0];

    await notifyUserAction("created", user);

    res.status(201).json(user);
  } catch (error) {
    console.error("POST /api/users:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    res.status(500).json({
      error: "Failed to add user",
    });
  }
});

// =========================
// Update User
// PATCH /api/users/:id
// Protected
// =========================

app.patch("/api/users/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `
        UPDATE users
        SET
          name = $1,
          email = $2
        WHERE id = $3
        RETURNING *
      `,
      [cleanName, cleanEmail, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const user = result.rows[0];

    await notifyUserAction("updated", user);

    res.json(user);
  } catch (error) {
    console.error("PATCH /api/users/:id:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    res.status(500).json({
      error: "Failed to update user",
    });
  }
});

// =========================
// Delete User
// DELETE /api/users/:id
// Protected
// =========================

app.delete("/api/users/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
        DELETE FROM users
        WHERE id = $1
        RETURNING *
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const user = result.rows[0];

    await notifyUserAction("deleted", user);

    res.json({
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    console.error("DELETE /api/users/:id:", error);

    res.status(500).json({
      error: "Failed to delete user",
    });
  }
});

// =========================
// 404
// =========================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// =========================
// Global Error Handler
// =========================

app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);

  res.status(500).json({
    error: "Internal server error",
  });
});

// =========================
// Start Server
// =========================

app.listen(PORT, () => {
  console.log(`TechFlow backend running on port ${PORT}`);
});
