import { API_ENDPOINTS } from "../../../api/config";

const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const parseResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const msg = data?.error || data?.message || "request failed";
    throw new Error(`[${response.status}] ${msg}`);
  }
  return data;
};

// Create a new group conversation
export const createGroup = async ({
  name,
  description,
  avatarColor,
  memberIds,
}) => {
  const response = await fetch(API_ENDPOINTS.GROUPS.BASE, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify({
      name,
      description: description || "",
      avatar_color: avatarColor || "bg-[var(--color-crazy-blue)]",
      member_ids: memberIds || [],
    }),
  });
  return parseResponse(response);
};

// Get all groups the current user belongs to
export const getUserGroups = async () => {
  const response = await fetch(API_ENDPOINTS.GROUPS.BASE, {
    method: "GET",
    headers: getAuthHeader(),
  });
  const data = await parseResponse(response);
  return data || [];
};

// Get a single group by ID
export const getGroupByID = async (groupId) => {
  const response = await fetch(API_ENDPOINTS.GROUPS.BY_ID(groupId), {
    method: "GET",
    headers: getAuthHeader(),
  });
  return parseResponse(response);
};

// Update group settings (name, description, photo, members)
export const updateGroup = async (
  groupId,
  { name, description, photo, avatarColor, memberIds },
) => {
  const response = await fetch(API_ENDPOINTS.GROUPS.BY_ID(groupId), {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify({
      name: name || "",
      description: description || "",
      photo: photo || "",
      avatar_color: avatarColor || "",
      member_ids: memberIds || null,
    }),
  });
  return parseResponse(response);
};

// Leave a group
export const leaveGroup = async (groupId) => {
  const response = await fetch(API_ENDPOINTS.GROUPS.LEAVE(groupId), {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  return parseResponse(response);
};

// Get enriched member list for a group (id, username, display_name)
export const getGroupMembers = async (groupId) => {
  const response = await fetch(
    `${API_ENDPOINTS.GROUPS.BY_ID(groupId)}/members`,
    {
      method: "GET",
      headers: getAuthHeader(),
    },
  );
  const data = await parseResponse(response);
  return data || [];
};
