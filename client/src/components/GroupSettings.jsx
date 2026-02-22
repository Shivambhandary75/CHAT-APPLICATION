import React, { useState, useEffect } from "react";
import { Users, Camera, UserPlus, X, Save, Loader, Search } from "lucide-react";
import CustomAlert from "./CustomAlert";
import { updateGroup, getGroupMembers } from "../api/groups";
import { getFriends } from "../api/friends";

const AVATAR_COLORS = [
  "bg-[var(--color-crazy-pink)]",
  "bg-[var(--color-crazy-blue)]",
  "bg-[var(--color-crazy-green)]",
  "bg-[var(--color-crazy-yellow)]",
];

export const getAvatarColor = (item, index = 0) =>
  item?.avatarColor || item?.avatar_color || AVATAR_COLORS[index % AVATAR_COLORS.length];

const GroupSettings = ({ group, onSave, onClose }) => {
  const [groupName, setGroupName] = useState(group?.name || "");
  const [groupPhoto, setGroupPhoto] = useState(group?.photo || null);
  const [groupDescription, setGroupDescription] = useState(group?.description || "");
  const [avatarColor, setAvatarColor] = useState(group?.avatar_color || AVATAR_COLORS[0]);

  // members = enriched objects {id, username, display_name}
  const [groupMembers, setGroupMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  // friends available to add (not yet in group)
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

  const [searchMember, setSearchMember] = useState("");
  const [saving, setSaving] = useState(false);
  const [alertState, setAlertState] = useState({ isOpen: false, message: "", type: "alert", onConfirm: null });

  // Fetch members and friends in parallel when modal opens
  useEffect(() => {
    if (!group?.id) return;

    setLoadingMembers(true);
    setLoadingFriends(true);

    getGroupMembers(group.id)
      .then((members) => setGroupMembers(members || []))
      .catch(() => setGroupMembers([]))
      .finally(() => setLoadingMembers(false));

    getFriends()
      .then((data) => setFriends(data || []))
      .catch(() => setFriends([]))
      .finally(() => setLoadingFriends(false));
  }, [group?.id]);

  if (!group) return null;

  const displayName = (person) => person.display_name || person.username || "Unknown";
  const initials = (person) => displayName(person).slice(0, 2).toUpperCase();

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setGroupPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addMember = (friend) => {
    if (!groupMembers.find((m) => m.id === friend.id)) {
      setGroupMembers([...groupMembers, friend]);
    }
  };

  const removeMember = (memberId) => {
    setAlertState({
      isOpen: true,
      message: "REMOVE THIS MEMBER FROM GROUP?",
      type: "confirm",
      onConfirm: () => setGroupMembers(groupMembers.filter((m) => m.id !== memberId)),
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const memberIds = groupMembers.map((m) => m.id).filter(Boolean);
      const saved = await updateGroup(group.id, {
        name: groupName,
        description: groupDescription,
        photo: groupPhoto || "",
        avatarColor,
        memberIds,
      });
      if (onSave) onSave({ ...saved, avatar_color: avatarColor });
      setAlertState({ isOpen: true, message: "GROUP SETTINGS SAVED!", type: "alert", onConfirm: null });
    } catch (err) {
      setAlertState({ isOpen: true, message: `ERROR: ${err.message}`, type: "alert", onConfirm: null });
    } finally {
      setSaving(false);
    }
  };

  // Friends not already in the group, filtered by search
  const addableFriends = friends
    .filter((f) => !groupMembers.find((m) => m.id === f.id))
    .filter((f) =>
      displayName(f).toLowerCase().includes(searchMember.toLowerCase()) ||
      (f.username || "").toLowerCase().includes(searchMember.toLowerCase())
    );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-6 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[var(--color-crazy-yellow)] border-b-4 border-black p-4 flex items-center justify-between">
          <h2 className="font-black text-2xl uppercase flex-1 text-center">GROUP SETTINGS</h2>
          <button
            onClick={onClose}
            className="bg-[var(--color-crazy-pink)] border-3 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-[var(--color-crazy-blue)]">
          <div className="space-y-6">
            {/* Group Photo */}
            <div className="flex flex-col items-center gap-4 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="relative">
                {groupPhoto ? (
                  <img src={groupPhoto} alt="Group" className="w-32 h-32 border-6 border-black rounded-full object-cover shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
                ) : (
                  <div className={`w-32 h-32 ${avatarColor} border-6 border-black rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
                    <Users size={60} />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-[var(--color-crazy-blue)] border-4 border-black rounded-full p-3 cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <Camera size={24} />
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
              <p className="text-sm font-bold uppercase">Edit Group Photo</p>
            </div>

            {/* Group Name */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <label className="block font-black text-lg mb-3 uppercase">Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full border-4 border-black px-4 py-4 text-lg font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                style={{ fontFamily: "var(--font-display)" }}
              />
            </div>

            {/* Description */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <label className="block font-black text-lg mb-3 uppercase">Description</label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Enter group description..."
                rows={3}
                className="w-full border-4 border-black px-4 py-3 text-base font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all resize-none"
                style={{ fontFamily: "var(--font-display)" }}
              />
            </div>

            {/* Current Members */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <label className="block font-black text-lg mb-3 uppercase">
                Members ({loadingMembers ? "…" : groupMembers.length})
              </label>
              <div className="border-4 border-black p-4 bg-[var(--color-crazy-pink)] max-h-48 overflow-y-auto space-y-2">
                {loadingMembers ? (
                  <div className="flex justify-center py-4"><Loader size={20} className="animate-spin" /></div>
                ) : groupMembers.length === 0 ? (
                  <p className="text-center font-bold py-4 uppercase text-sm">No members yet</p>
                ) : (
                  groupMembers.map((member, idx) => (
                    <div key={member.id} className="bg-white border-3 border-black p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} border-3 border-black rounded-full flex items-center justify-center font-black text-xs`}>
                          {initials(member)}
                        </div>
                        <div>
                          <p className="font-black">{displayName(member)}</p>
                          <p className="font-bold text-xs">@{member.username}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeMember(member.id)}
                        className="bg-[var(--color-crazy-pink)] border-3 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add Members */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <label className="block font-black text-lg mb-3 uppercase">Add Members</label>
              <div className="flex items-center border-4 border-black bg-white mb-3">
                <Search size={16} className="ml-3" />
                <input
                  type="text"
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  placeholder="Search friends..."
                  className="flex-1 px-3 py-3 font-bold bg-transparent focus:outline-none"
                  style={{ fontFamily: "var(--font-display)" }}
                />
              </div>
              <div className="border-4 border-black p-4 bg-[var(--color-crazy-yellow)] max-h-48 overflow-y-auto space-y-2">
                {loadingFriends ? (
                  <div className="flex justify-center py-4"><Loader size={20} className="animate-spin" /></div>
                ) : addableFriends.length === 0 ? (
                  <p className="text-center font-bold py-4 uppercase text-sm">
                    {friends.length === 0 ? "No friends yet" : searchMember ? "No match" : "All friends already added"}
                  </p>
                ) : (
                  addableFriends.map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => addMember(friend)}
                      className="w-full bg-white border-3 border-black p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[var(--color-crazy-green)] transition-all text-left flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--color-crazy-blue)] border-3 border-black rounded-full flex items-center justify-center font-black text-xs">
                          {initials(friend)}
                        </div>
                        <div>
                          <p className="font-black">{displayName(friend)}</p>
                          <p className="font-bold text-xs">@{friend.username}</p>
                        </div>
                      </div>
                      <UserPlus size={18} />
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-[var(--color-crazy-green)] border-4 border-black font-black px-6 py-4 text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-3"
              >
                {saving ? <Loader size={24} className="animate-spin" /> : <Save size={24} />}
                SAVE CHANGES
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-[var(--color-crazy-pink)] border-4 border-black font-black px-6 py-4 text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>

        <CustomAlert
          isOpen={alertState.isOpen}
          onClose={() => setAlertState({ isOpen: false, message: "", type: "alert", onConfirm: null })}
          message={alertState.message}
          type={alertState.type}
          onConfirm={alertState.onConfirm}
        />
      </div>
    </div>
  );
};

export default GroupSettings;
