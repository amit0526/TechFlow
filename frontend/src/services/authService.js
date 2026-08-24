// ======================================================
// API CONFIGURATION
// ======================================================

const ENV_API_URL = import.meta.env.VITE_API_URL;

const DEFAULT_API_URL = "https://techflow-backend-pgx4.onrender.com";

const BASE_API_URL = (ENV_API_URL || DEFAULT_API_URL).replace(/\/+$/, "");

const API_URL = BASE_API_URL.endsWith("/api/auth")
  ? BASE_API_URL
  : `${BASE_API_URL}/api/auth`;

// ======================================================
// AUTH STORAGE KEYS
// ======================================================

const TOKEN_KEY = "techflow_token";
const ADMIN_KEY = "techflow_admin";
const AUTH_KEY = "techflow_auth";

// ======================================================
// Clear Authentication
// ======================================================

export function clearAuthentication() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
  localStorage.removeItem(AUTH_KEY);

  // Remove old keys from previous versions
  localStorage.removeItem("techflowToken");
  localStorage.removeItem("techflowAdmin");
  localStorage.removeItem("techflowAuth");
}

// ======================================================
// Login
// ======================================================

export async function loginAdmin(email, password) {
  const cleanEmail = email?.trim().toLowerCase();

  if (!cleanEmail || !password) {
    throw new Error("Email and password are required.");
  }

  let response;

  try {
    response = await fetch(`${API_URL}/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify({
        email: cleanEmail,
        password,
      }),
    });
  } catch (error) {
    console.error("Login request failed:", error);

    throw new Error("Unable to connect to the server. Please try again.");
  }

  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    console.error("Failed to parse server response:", error);

    data = null;
  }

  // ====================================================
  // Login Error
  // ====================================================

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Login failed with status ${response.status}`,
    );
  }

  // ====================================================
  // Validate JWT
  // ====================================================

  if (!data?.token) {
    throw new Error(
      "Login succeeded but authentication token was not received.",
    );
  }

  // ====================================================
  // Admin Data
  // ====================================================

  const admin = {
    name: data.admin?.name || "Admin",

    email: data.admin?.email || cleanEmail,

    role: data.admin?.role || "Administrator",
  };

  // ====================================================
  // Save Authentication
  // ====================================================

  localStorage.setItem(TOKEN_KEY, data.token);

  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));

  localStorage.setItem(AUTH_KEY, "true");

  // ====================================================
  // Remove Old Authentication Keys
  // ====================================================

  localStorage.removeItem("techflowToken");

  localStorage.removeItem("techflowAdmin");

  localStorage.removeItem("techflowAuth");

  // ====================================================
  // Return Login Data
  // ====================================================

  return {
    ...data,
    admin,
  };
}

// ======================================================
// Logout
// ======================================================

export function logoutAdmin() {
  clearAuthentication();
}

// ======================================================
// Get Token
// ======================================================

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// ======================================================
// Get Current Admin
// ======================================================

export function getCurrentAdmin() {
  const admin = localStorage.getItem(ADMIN_KEY);

  if (!admin) {
    return null;
  }

  try {
    return JSON.parse(admin);
  } catch (error) {
    console.error("Failed to parse admin information:", error);

    localStorage.removeItem(ADMIN_KEY);

    return null;
  }
}

// ======================================================
// Authentication Check
// ======================================================

export function isAuthenticated() {
  const token = getToken();

  const auth = localStorage.getItem(AUTH_KEY);

  return Boolean(token && auth === "true");
}

// ======================================================
// Get API URL
// Useful for other frontend API files
// ======================================================

export function getApiUrl() {
  return API_URL;
}
