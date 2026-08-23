const API_URL = "http://localhost:5000/api/users";

// =========================
// API Request Helper
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

  // Token invalid / expired
  if (response.status === 401) {
    throw new Error(data?.error || "Session expired. Please login again.");
  }

  if (!response.ok) {
    throw new Error(
      data?.error || `Request failed with status ${response.status}`,
    );
  }

  return data;
};

// =========================
// Get All Users
// =========================

export const getUsers = async () => {
  return request(API_URL);
};

// =========================
// Get Single User
// =========================

export const getUser = async (id) => {
  return request(`${API_URL}/${id}`);
};

// =========================
// Create User
// =========================

export const createUser = async (user) => {
  return request(API_URL, {
    method: "POST",
    body: JSON.stringify(user),
  });
};

// =========================
// Update User
// =========================

export const updateUser = async (id, user) => {
  return request(`${API_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(user),
  });
};

// =========================
// Delete User
// =========================

export const deleteUser = async (id) => {
  return request(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};
