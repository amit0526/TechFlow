const API_URL = "http://localhost:5000/api/settings";

const TOKEN_KEY = "techflow_token";

// =========================
// Clear Authentication
// =========================

function clearAuthentication() {
  localStorage.removeItem("techflow_token");
  localStorage.removeItem("techflow_admin");
  localStorage.removeItem("techflow_auth");

  // Old keys cleanup
  localStorage.removeItem("techflowToken");
  localStorage.removeItem("techflowAdmin");
  localStorage.removeItem("techflowAuth");
}

// =========================
// API Request Helper
// =========================

async function request(url, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("Authentication token missing. Please login again.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",

      ...(options.body
        ? {
            "Content-Type": "application/json",
          }
        : {}),

      Authorization: `Bearer ${token}`,

      ...(options.headers || {}),
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // =========================
  // Authentication Error
  // =========================

  if (response.status === 401 || response.status === 403) {
    clearAuthentication();

    const error = new Error("Session expired. Please login again.");

    error.code = "AUTH_EXPIRED";
    error.status = response.status;

    throw error;
  }

  // =========================
  // API Error
  // =========================

  if (!response.ok) {
    const error = new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`,
    );

    error.status = response.status;

    throw error;
  }

  return data;
}

// =========================
// Get Settings
// =========================

export async function getSettings() {
  return request(API_URL);
}

// =========================
// Update Settings
// =========================

export async function updateSettings(settings) {
  if (!settings || typeof settings !== "object") {
    throw new Error("Settings data is required.");
  }

  const {
    emailNotifications,
    userNotifications,
    maintenanceMode,
    compactMode,
  } = settings;

  // Validate before API request
  if (
    typeof emailNotifications !== "boolean" ||
    typeof userNotifications !== "boolean" ||
    typeof maintenanceMode !== "boolean" ||
    typeof compactMode !== "boolean"
  ) {
    throw new Error("All settings must be boolean values.");
  }

  return request(API_URL, {
    method: "PATCH",
    body: JSON.stringify({
      emailNotifications,
      userNotifications,
      maintenanceMode,
      compactMode,
    }),
  });
}
