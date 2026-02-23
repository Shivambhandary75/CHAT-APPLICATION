import React, { useState, useEffect } from "react";
import { Users, MessageCircle, LogOut, Settings, Search, Loader, X, UserPlus } from "lucide-react";
import CustomAlert from "./CustomAlert";
import { createGroup, getUserGroups, leaveGroup } from "../api/groups";
import { getFriends } from "../api/friends";
import chatService from "../features/chat/services/ChatService";
import { useChatStore } from "../features/chat/store/ChatStore";

// Map index to a cycling avatar color
const AVATAR_COLORS = [
  "bg-[var(--color-crazy-pink)]",
  "bg-[var(--color-crazy-blue)]",
  "bg-[var(--color-crazy-green)]",
  "bg-[var(--color-crazy-yellow)]",
];

const Groups = ({ onSelectGroup, showCreateSection = true, onGroupSettings }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const setSelectedConversation = useChatStore((s) => s.setSelectedConversation);
  const setMessages = useChatStore((s) => s.setMessages);

  // Fetch groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const data = await getUserGroups();
        setGroups(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateForm = async () => {
    setShowCreateGroup(true);
    setFriendsLoading(true);
    try {
      const data = await getFriends();
      setFriends(data || []);
    } catch {
      setFriends([]);
    } finally {
      setFriendsLoading(false);
    }
  };

  const closeCreateForm = () => {
    setShowCreateGroup(false);
    setNewGroupName("");
    setNewGroupDesc("");
    setSelectedMembers([]);
    setMemberSearch("");
    setActionError(null);
  };

  const toggleMember = (friend) => {
    setSelectedMembers((prev) =>
      prev.find((m) => m.id === friend.id)
        ? prev.filter((m) => m.id !== friend.id)
        : [...prev, friend]
    );
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      setCreating(true);
      setActionError(null);
      const avatarColor = AVATAR_COLORS[groups.length % AVATAR_COLORS.length];
      const newGroup = await createGroup({
        name: newGroupName.trim().toUpperCase(),
        description: newGroupDesc.trim(),
        avatarColor,
        memberIds: selectedMembers.map((m) => m.id),
      });
      setGroups([newGroup, ...groups]);
      closeCreateForm();
    } catch (err) {
      console.error("Create group failed:", err);
      setActionError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleLeaveGroup = (group) => {
    setConfirmState({
      isOpen: true,
      message: `LEAVE ${group.name}?`,
      onConfirm: async () => {
        try {
          await leaveGroup(group.id);
          setGroups((prev) => prev.filter((g) => g.id !== group.id));
        } catch (err) {
          console.error("Leave group failed:", err);
          setActionError(err.message);
        }
      },
    });
  };

  // Resolve avatar color — use stored value or cycle through defaults
  const getAvatarColor = (group, index) =>
    group.avatar_color || AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div className="h-full bg-[var(--color-crazy-blue)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--color-crazy-yellow)] border-b-4 border-black p-4">
        <h2 className="font-black text-2xl uppercase text-center">GROUPS</h2>
      </div>

      {/* Create Group Section */}
      {showCreateSection && (
        <div className={`border-b-4 border-black bg-[var(--color-crazy-pink)] ${showCreateGroup ? "p-4" : "p-4"}`}>
          {!showCreateGroup ? (
            <button
              onClick={openCreateForm}
              className="w-full bg-[var(--color-crazy-green)] border-4 border-black font-black px-4 py-3 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2"
            >
              <Users size={20} />
              CREATE GROUP
            </button>
          ) : (
            <div className="space-y-3">
              {actionError && (
                <div className="bg-red-100 border-3 border-red-600 p-2 flex items-center justify-between">
                  <p className="font-bold text-sm text-red-700">{actionError}</p>
                  <button onClick={() => setActionError(null)} className="font-black text-red-700 ml-2">✕</button>
                </div>
              )}

              {/* Group Name */}
              <div>
                <p className="font-black text-xs uppercase mb-1">GROUP NAME</p>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className="w-full border-4 border-black px-3 py-2 font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                  style={{ fontFamily: "var(--font-display)" }}
                />
              </div>

              {/* Description */}
              <div>
                <p className="font-black text-xs uppercase mb-1">DESCRIPTION</p>
                <textarea
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Enter group description..."
                  rows={2}
                  className="w-full border-4 border-black px-3 py-2 font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none resize-none"
                  style={{ fontFamily: "var(--font-display)" }}
                />
              </div>

              {/* Add Members */}
              <div>
                <p className="font-black text-xs uppercase mb-1">
                  ADD MEMBERS ({selectedMembers.length})
                </p>

                {/* Selected member chips */}
                {selectedMembers.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedMembers.map((m) => (
                      <span
                        key={m.id}
                        className="flex items-center gap-1 bg-[var(--color-crazy-blue)] border-2 border-black px-2 py-0.5 font-bold text-xs uppercase"
                      >
                        {m.display_name || m.username}
                        <button onClick={() => toggleMember(m)} className="ml-1 font-black">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Friend search + list */}
                <div className="border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center border-b-2 border-black px-2">
                    <Search size={14} />
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder="Search friends..."
                      className="flex-1 px-2 py-1.5 font-bold text-sm bg-transparent focus:outline-none"
                      style={{ fontFamily: "var(--font-display)" }}
                    />
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {friendsLoading ? (
                      <div className="flex justify-center py-3">
                        <Loader size={16} className="animate-spin" />
                      </div>
                    ) : friends.filter((f) =>
                      (f.display_name || f.username)
                        .toLowerCase()
                        .includes(memberSearch.toLowerCase())
                    ).length === 0 ? (
                      <p className="font-bold text-xs text-center py-3 text-gray-500 uppercase">
                        {friends.length === 0 ? "No friends yet" : "No match"}
                      </p>
                    ) : (
                      friends
                        .filter((f) =>
                          (f.display_name || f.username)
                            .toLowerCase()
                            .includes(memberSearch.toLowerCase())
                        )
                        .map((friend) => {
                          const isSelected = selectedMembers.some((m) => m.id === friend.id);
                          return (
                            <button
                              key={friend.id}
                              onClick={() => toggleMember(friend)}
                              className={`w-full flex items-center gap-2 px-3 py-2 font-bold text-sm text-left border-b border-gray-200 last:border-0 transition-colors ${isSelected ? "bg-[var(--color-crazy-green)]" : "hover:bg-gray-50"
                                }`}
                            >
                              <div className="w-6 h-6 bg-[var(--color-crazy-yellow)] border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-black">
                                  {(friend.display_name || friend.username)[0].toUpperCase()}
                                </span>
                              </div>
                              <span className="flex-1 uppercase text-xs">
                                {friend.display_name || friend.username}
                              </span>
                              {isSelected && <span className="text-xs font-black">✓</span>}
                            </button>
                          );
                        })
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleCreateGroup}
                  disabled={creating || !newGroupName.trim()}
                  className="flex-1 bg-[var(--color-crazy-blue)] border-3 border-black font-black px-3 py-2 uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-60 flex items-center justify-center gap-1"
                >
                  {creating ? <Loader size={14} className="animate-spin" /> : <UserPlus size={14} />}
                  CREATE
                </button>
                <button
                  onClick={closeCreateForm}
                  className="flex-1 bg-[var(--color-crazy-yellow)] border-3 border-black font-black px-3 py-2 uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 border-b-4 border-black bg-[var(--color-crazy-green)]">
        <div className="relative flex items-center">
          <Search className="absolute left-3 pointer-events-none" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups..."
            className="w-full border-4 border-black pl-12 pr-4 py-3 font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ fontFamily: "var(--font-display)" }}
          />
        </div>
      </div>

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Action error banner (leave errors, shown when create form is closed) */}
        {actionError && !showCreateGroup && (
          <div className="bg-red-100 border-4 border-red-600 p-3 flex items-center justify-between">
            <p className="font-bold text-sm text-red-700">{actionError}</p>
            <button onClick={() => setActionError(null)} className="font-black text-red-700 ml-2">✕</button>
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={32} className="animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white border-4 border-black p-8 text-center">
            <p className="font-black text-lg uppercase text-red-600">ERROR</p>
            <p className="font-bold text-sm mt-2">{error}</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="bg-white border-4 border-black p-8 text-center">
            <p className="font-black text-lg uppercase">
              {searchQuery ? "NO GROUPS FOUND" : "NO GROUPS YET"}
            </p>
            <p className="font-bold text-sm mt-2">
              {searchQuery ? "Try a different search term" : "Create your first group above!"}
            </p>
          </div>
        ) : (
          filteredGroups.map((group, index) => (
            <div
              key={group.id}
              className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="relative">
                    {group.photo ? (
                      <img
                        src={group.photo}
                        alt={group.name}
                        className="w-12 h-12 border-4 border-black rounded-full object-cover"
                      />
                    ) : (
                      <div className={`w-12 h-12 ${getAvatarColor(group, index)} border-4 border-black rounded-full flex items-center justify-center`}>
                        <Users size={24} className="font-black" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg uppercase">{group.name}</h3>
                    <p className="font-bold text-sm flex items-center gap-1">
                      <Users size={14} />
                      {(group.members || []).length} MEMBERS
                    </p>
                    {group.description && (
                      <p className="font-bold text-xs mt-1 text-gray-600">
                        {group.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const conversation = await chatService.getOrCreateGroupConversation(group.id);
                        conversation.display_name = group.name;
                        conversation.name = group.name;
                        setSelectedConversation(conversation);

                        const conversationId = conversation.id;
                        const msgs = await chatService.fetchMessages(conversationId);
                        setMessages(conversationId, msgs);

                        if (onSelectGroup) onSelectGroup(group);
                      } catch (err) {
                        console.error("Failed to open group chat:", err);
                      }
                    }}
                    className="bg-[var(--color-crazy-green)] border-3 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    <MessageCircle size={18} />
                  </button>
                  <button
                    onClick={() => onGroupSettings && onGroupSettings(group)}
                    className="bg-[var(--color-crazy-yellow)] border-3 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    <Settings size={18} />
                  </button>
                  <button
                    onClick={() => handleLeaveGroup(group)}
                    className="bg-[var(--color-crazy-pink)] border-3 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-[var(--color-crazy-yellow)] border-t-4 border-black p-4 text-center">
        <p className="font-black uppercase">
          {searchQuery
            ? `SHOWING: ${filteredGroups.length} / ${groups.length}`
            : `TOTAL GROUPS: ${groups.length}`}
        </p>
      </div>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, message: "", onConfirm: null })}
        message={confirmState.message}
        type="confirm"
        onConfirm={confirmState.onConfirm}
      />
    </div>
  );
};

export default Groups;
