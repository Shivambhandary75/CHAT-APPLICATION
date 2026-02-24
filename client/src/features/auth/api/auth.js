import { API_ENDPOINTS } from "../../../api/config";

// Register a new user
export const registerUser = async (
  username,
  email,
  password,
  displayName = "",
) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        display_name: displayName || username,
      }),
    });

    // Try to parse JSON response
    let data = null;
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    } catch (e) {
      // If JSON parsing fails, use default error
      data = { error: "registration failed" };
    }

    // If response is not ok, throw the error from backend
    if (!response.ok) {
      throw new Error(data?.error || "registration failed");
    }

    return data;
  } catch (error) {
    // Re-throw the error with its message intact
    throw error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    // Try to parse JSON response
    let data = null;
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    } catch (e) {
      // If JSON parsing fails, use default error
      data = { error: "invalid credentials" };
    }

    // If response is not ok, throw the error from backend
    if (!response.ok) {
      throw new Error(data?.error || "invalid credentials");
    }

    // Store token and user_id in localStorage
    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }
    if (data.user_id) {
      localStorage.setItem("user_id", data.user_id);
    }

    return data;
  } catch (error) {
    // Re-throw the error with its message intact
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      // If JSON parsing fails, still clear token on successful status
      if (response.ok) {
        localStorage.removeItem("authToken");
        return { status: "logged out" };
      }
      throw new Error("Server response error");
    }

    if (!response.ok) {
      throw new Error(data.error || "Logout failed");
    }

    // Clear token and user_id from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user_id");

    return data;
  } catch (error) {
    if (error.message) {
      throw error;
    }
    throw new Error("Network error. Please check your connection.");
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

// Verify token with backend
export const verifyToken = async () => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return false;
    }

    const response = await fetch(API_ENDPOINTS.AUTH.VERIFY, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Token is invalid, remove it
      localStorage.removeItem("authToken");
      return false;
    }

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    // On error, remove token and return false
    localStorage.removeItem("authToken");
    return false;
  }
};

// Get token
export const getToken = () => {
  return localStorage.getItem("authToken");
};

// Get user profile from backend
export const getProfile = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to get profile");
  return data;
};

// Update user display name
export const updateProfile = async (displayName) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ display_name: displayName }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to update profile");
  return data;
};
