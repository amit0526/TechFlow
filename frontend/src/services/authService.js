const API_URL = "http://localhost:5000/api/auth";

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Login failed");
  }

  // JWT token save
  if (data.token) {
    localStorage.setItem("techflow_token", data.token);
  }

  // Admin details save if returned
  if (data.admin) {
    localStorage.setItem("techflow_admin", JSON.stringify(data.admin));
  }

  return data;
}

export function logoutAdmin() {
  localStorage.removeItem("techflow_token");
  localStorage.removeItem("techflow_admin");
}

export function getToken() {
  return localStorage.getItem("techflow_token");
}

export function getCurrentAdmin() {
  const admin = localStorage.getItem("techflow_admin");

  try {
    return admin ? JSON.parse(admin) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}
