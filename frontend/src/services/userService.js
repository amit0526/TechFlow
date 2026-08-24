const API_URL = "http://localhost:5000/api/users";

const TOKEN_KEY = "techflow_token";

// =========================
// Clear Authentication
// =========================

function clearAuthentication() {
  localStorage.removeItem("techflow_token");
  localStorage.removeItem("techflow_admin");
  localStorage.removeItem("techflow_auth");
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

    const authError = new Error("Session expired. Please login again.");

    authError.code = "AUTH_EXPIRED";
    authError.status = response.status;

    throw authError;
  }

  // =========================
  // API Error
  // =========================

  if (!response.ok) {
    const apiError = new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`,
    );

    apiError.status = response.status;

    throw apiError;
  }

  return data;
}

// =========================
// Get All Users
// =========================

export async function getUsers() {
  return request(API_URL);
}

// =========================
// Get Single User
// =========================

export async function getUser(id) {
  if (!id) {
    throw new Error("User ID is required.");
  }

  return request(`${API_URL}/${id}`);
}

// =========================
// Create User
// =========================

export async function createUser(userData) {
  const name = userData?.name?.trim();
  const email = userData?.email?.trim().toLowerCase();

  if (!name || !email) {
    throw new Error("Name and email are required.");
  }

  return request(API_URL, {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
    }),
  });
}

// =========================
// Update User
// =========================

export async function updateUser(id, userData) {
  if (!id) {
    throw new Error("User ID is required.");
  }

  const name = userData?.name?.trim();
  const email = userData?.email?.trim().toLowerCase();

  if (!name || !email) {
    throw new Error("Name and email are required.");
  }

  return request(`${API_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name,
      email,
    }),
  });
}

// =========================
// Delete User
// =========================

export async function deleteUser(id) {
  if (!id) {
    throw new Error("User ID is required.");
  }

  return request(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
