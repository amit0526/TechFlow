const API_URL = "http://localhost:5000/api/auth";

// =========================
// Login
// =========================

export async function loginAdmin(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error || data?.message || "Invalid email or password.",
    );
  }

  if (!data?.token) {
    throw new Error(
      "Login succeeded but authentication token was not received.",
    );
  }

  // =========================
  // Save JWT
  // =========================

  localStorage.setItem("techflow_token", data.token);

  // =========================
  // Save Admin
  // =========================

  const admin = {
    name: data.admin?.name || "Admin",
    email: data.admin?.email || email,
    role: data.admin?.role || "Administrator",
  };

  localStorage.setItem("techflow_admin", JSON.stringify(admin));

  // =========================
  // Authentication Flag
  // =========================

  localStorage.setItem("techflow_auth", "true");

  return {
    ...data,
    admin,
  };
}

// =========================
// Logout
// =========================

export function logoutAdmin() {
  localStorage.removeItem("techflow_token");
  localStorage.removeItem("techflow_admin");
  localStorage.removeItem("techflow_auth");
}

// =========================
// Get Token
// =========================

export function getToken() {
  return localStorage.getItem("techflow_token");
}

// =========================
// Get Current Admin
// =========================

export function getCurrentAdmin() {
  const admin = localStorage.getItem("techflow_admin");

  if (!admin) {
    return null;
  }

  try {
    return JSON.parse(admin);
  } catch {
    return null;
  }
}

// =========================
// Authentication Check
// =========================

export function isAuthenticated() {
  const token = localStorage.getItem("techflow_token");
  const auth = localStorage.getItem("techflow_auth");

  return Boolean(token && auth === "true");
}
