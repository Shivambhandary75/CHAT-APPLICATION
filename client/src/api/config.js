// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  FRIENDS: {
    SEND_REQUEST: `${API_BASE_URL}/api/friends/request`,
    ACCEPT_REQUEST: (id) => `${API_BASE_URL}/api/friends/accept/${id}`,
    REJECT_REQUEST: (id) => `${API_BASE_URL}/api/friends/reject/${id}`,
    CANCEL_REQUEST: (id) => `${API_BASE_URL}/api/friends/cancel/${id}`,
    RECEIVED_REQUESTS: `${API_BASE_URL}/api/friends/requests/received`,
    SENT_REQUESTS: `${API_BASE_URL}/api/friends/requests/sent`,
    LIST: `${API_BASE_URL}/api/friends`,
    SEARCH: `${API_BASE_URL}/api/friends/search`,
  },
  CONVERSATION: {
    BASE: `${API_BASE_URL}/conversations`,
  },
  MESSAGE: {
    BASE: `${API_BASE_URL}/messages`,
  },
};

export default API_BASE_URL;
