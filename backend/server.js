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

// ======================================================
// ALLOWED FRONTEND ORIGINS
// ======================================================

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5000",
  "https://techflow-fronted.onrender.com",
]);

// ======================================================
// CORS - EXPLICIT
// ======================================================

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept",
  );

  res.setHeader("Access-Control-Max-Age", "86400");
}

// ======================================================
// CORS MIDDLEWARE
// IMPORTANT: MUST BE BEFORE ALL ROUTES
// ======================================================

app.use((req, res, next) => {
  setCorsHeaders(req, res);

  // Handle browser preflight request
  if (req.method === "OPTIONS") {
    const origin = req.headers.origin;

    if (origin && !allowedOrigins.has(origin)) {
      return res.status(403).json({
        error: "CORS origin not allowed",
      });
    }

    return res.sendStatus(204);
  }

  next();
});

// ======================================================
// CORS PACKAGE
// ======================================================

app.use(
  cors({
    origin: (origin, callback) => {
      // Server-to-server / health-check requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      console.warn("Blocked CORS origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization", "Accept"],

    credentials: false,

    optionsSuccessStatus: 204,
  }),
);

// ======================================================
// BODY PARSER
// ======================================================

app.use(express.json());

// ======================================================
// ROOT
// ======================================================

app.get("/", (req, res) => {
  res.json({
    message: "TechFlow backend is running 🚀",
  });
});

// ======================================================
// HEALTH CHECK
// ======================================================

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

// ======================================================
// AUTH ROUTES
// ======================================================

app.use("/api/auth", authRoutes);

// ======================================================
// SETTINGS ROUTES
// ======================================================

app.use("/api/settings", settingsRoutes);

// ======================================================
// EMAIL NOTIFICATION SETTING
// ======================================================

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

// ======================================================
// USER EMAIL NOTIFICATION
// ======================================================

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

// ======================================================
// GET ALL USERS
// ======================================================

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

// ======================================================
// GET SINGLE USER
// ======================================================

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

// ======================================================
// CREATE USER
// ======================================================

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

// ======================================================
// UPDATE USER
// ======================================================

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

// ======================================================
// DELETE USER
// ======================================================

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

// ======================================================
// 404
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS origin not allowed",
    });
  }

  res.status(500).json({
    error: "Internal server error",
  });
});

// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, "0.0.0.0", () => {
  console.log(`TechFlow backend running on port ${PORT}`);

  console.log(`Allowed frontend: https://techflow-fronted.onrender.com`);
});
