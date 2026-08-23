const API_URL = "http://localhost:5000/api/settings";

// =========================
// API Helper
// =========================

const request = async (url, options = {}) => {
  const token = localStorage.getItem("techflow_token");

  if (!token) {
    throw new Error("Authentication token missing.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
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

  if (!response.ok) {
    throw new Error(
      data?.error || `Request failed with status ${response.status}`,
    );
  }

  return data;
};

// =========================
// Get Settings
// =========================

export const getSettings = async () => {
  return request(API_URL);
};

// =========================
// Update Settings
// =========================

export const updateSettings = async (settings) => {
  return request(API_URL, {
    method: "PATCH",
    body: JSON.stringify(settings),
  });
};
