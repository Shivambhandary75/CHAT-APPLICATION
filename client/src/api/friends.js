import { API_ENDPOINTS } from "./config";

// Helper to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Send friend request
export const sendFriendRequest = async (username) => {
  try {
    const response = await fetch(API_ENDPOINTS.FRIENDS.SEND_REQUEST, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({ username }),
    });

    let data = null;
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    } catch (e) {
      data = { error: "invalid response" };
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("unauthorized - please login first");
      }
      throw new Error(data?.error || "failed to send friend request");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Accept friend request
export const acceptFriendRequest = async (requestId) => {
  try {
    const response = await fetch(
      API_ENDPOINTS.FRIENDS.ACCEPT_REQUEST(requestId),
      {
        method: "POST",
        headers: getAuthHeader(),
      },
    );

    let data = null;
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    } catch (e) {
      data = { error: "invalid response" };
    }

    if (!response.ok) {
      throw new Error(data?.error || "failed to accept friend request");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Reject friend request
export const rejectFriendRequest = async (requestId) => {
  try {
    const response = await fetch(
      API_ENDPOINTS.FRIENDS.REJECT_REQUEST(requestId),
      {
        method: "POST",
        headers: getAuthHeader(),
      },
    );

    let data = null;
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    } catch (e) {
      data = { error: "invalid response" };
    }

    if (!response.ok) {
      throw new Error(data?.error || "failed to reject friend request");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Cancel sent friend request
export const cancelFriendRequest = async (requestId) => {
  try {
    const response = await fetch(
      API_ENDPOINTS.FRIENDS.CANCEL_REQUEST(requestId),
      {
        method: "DELETE",
        headers: getAuthHeader(),
      },
    );

    let data = null;
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    } catch (e) {
      data = { error: "invalid response" };
    }

    if (!response.ok) {
      throw new Error(data?.error || "failed to cancel friend request");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get received friend requests
export const getReceivedRequests = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.FRIENDS.RECEIVED_REQUESTS, {
      method: "GET",
      headers: getAuthHeader(),
    });

    let data = null;
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    } catch (e) {
      data = { error: "invalid response" };
    }

    if (!response.ok) {
      throw new Error(data?.error || "failed to fetch received requests");
    }

    return data.requests || [];
  } catch (error) {
    throw error;
  }
};

// Get sent friend requests
export const getSentRequests = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.FRIENDS.SENT_REQUESTS, {
      method: "GET",
      headers: getAuthHeader(),
    });

    let data = null;
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    } catch (e) {
      data = { error: "invalid response" };
    }

    if (!response.ok) {
      throw new Error(data?.error || "failed to fetch sent requests");
    }

    return data.requests || [];
  } catch (error) {
    throw error;
  }
};

// Get friends list
export const getFriends = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.FRIENDS.LIST, {
      method: "GET",
      headers: getAuthHeader(),
    });

    let data = null;
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    } catch (e) {
      data = { error: "invalid response" };
    }

    if (!response.ok) {
      throw new Error(data?.error || "failed to fetch friends");
    }

    return data.friends || [];
  } catch (error) {
    throw error;
  }
};

// Search users
export const searchUsers = async (query) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.FRIENDS.SEARCH}?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: getAuthHeader(),
      },
    );

    let data = null;
    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    } catch (e) {
      data = { error: "invalid response" };
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("unauthorized - please login first");
      }
      throw new Error(data?.error || "failed to search users");
    }

    return data.users || [];
  } catch (error) {
    throw error;
  }
};
