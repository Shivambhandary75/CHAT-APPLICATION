// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  CONVERSATION: {
    BASE: `${API_BASE_URL}/conversations`,
  },
  MESSAGE: {
    BASE: `${API_BASE_URL}/messages`,
  },
};

export default API_BASE_URL;
