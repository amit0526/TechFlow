const API_URL = "http://localhost:5000/api/users";

// =========================
// API Helper
// =========================

const request = async (url, options = {}) => {
  const token = localStorage.getItem("techflowToken");

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...(options.headers || {}),
      },
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (response.status === 401) {
      localStorage.removeItem("techflowToken");
      localStorage.removeItem("techflowAuth");
      localStorage.removeItem("techflowAdmin");

      window.location.href = "/login";

      throw new Error("Session expired. Please login again.");
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
    method: "PATCH",
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
