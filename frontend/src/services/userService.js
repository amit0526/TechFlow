const API_URL = "http://localhost:5000/api/users";

// =========================
// API Helper
// =========================

const request = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
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
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the backend server. Make sure the backend is running on port 5000.",
      );
    }

    throw error;
  }
};

// =========================
// Get Users
// =========================

export const getUsers = async () => {
  return request(API_URL);
};

// =========================
// Create User
// =========================

export const createUser = async (userData) => {
  return request(API_URL, {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

// =========================
// Update User
// =========================

export const updateUser = async (id, userData) => {
  return request(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
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
