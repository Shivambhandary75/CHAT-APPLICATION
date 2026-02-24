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

// Update group settings (name, description, photo file, members)
// photoFile is an optional File object; if omitted the existing photo is kept.
export const updateGroup = async (
  groupId,
  { name, description, photoFile, avatarColor, memberIds },
) => {
  const token = localStorage.getItem("authToken");

  const formData = new FormData();
  if (name) formData.append("name", name);
  if (description !== undefined) formData.append("description", description);
  if (avatarColor) formData.append("avatar_color", avatarColor);
  if (memberIds) formData.append("member_ids", JSON.stringify(memberIds));
  if (photoFile) formData.append("photo", photoFile);

  const response = await fetch(API_ENDPOINTS.GROUPS.BY_ID(groupId), {
    method: "PUT",
    headers: {
      // Do NOT set Content-Type – browser adds the multipart boundary automatically
      Authorization: `Bearer ${token}`,
    },
    body: formData,
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
