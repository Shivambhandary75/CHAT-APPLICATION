import React, { useState } from "react";
import { Users, MessageCircle, UserPlus, LogOut, Settings } from "lucide-react";
import CustomAlert from "./CustomAlert";

const GROUPS_DATA = [
  {
    id: "1",
    name: "CHAOS ZONE",
    members: 42,
    avatarColor: "bg-[var(--color-crazy-pink)]",
    lastMessage: "LET THE CHAOS BEGIN!",
    unread: 5,
  },
  {
    id: "2",
    name: "RETRO GANG",
    members: 28,
    avatarColor: "bg-[var(--color-crazy-blue)]",
    lastMessage: "WHO REMEMBERS DIAL-UP?",
    unread: 0,
  },
  {
    id: "3",
    name: "PIXEL PARTY",
    members: 156,
    avatarColor: "bg-[var(--color-crazy-green)]",
    lastMessage: "8-BIT VIBES ONLY",
    unread: 12,
  },
  {
    id: "4",
    name: "VAPORWAVE VIBES",
    members: 89,
    avatarColor: "bg-[var(--color-crazy-yellow)]",
    lastMessage: "AESTHETIC OVERLOAD",
    unread: 3,
  },
  {
    id: "5",
    name: "TEXT ENERGY CLUB",
    members: 234,
    avatarColor: "bg-[var(--color-crazy-pink)]",
    lastMessage: "NO EMOJIS ZONE!",
    unread: 0,
  },
];

const Groups = ({ onSelectGroup, showCreateSection = true }) => {
  const [groups, setGroups] = useState(GROUPS_DATA);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: Date.now().toString(),
        name: newGroupName.toUpperCase(),
        members: 1,
        avatarColor: "bg-[var(--color-crazy-blue)]",
        lastMessage: "GROUP CREATED!",
        unread: 0,
      };
      setGroups([newGroup, ...groups]);
      setNewGroupName("");
      setShowCreateGroup(false);
    }
  };

  const handleLeaveGroup = (group) => {
    setConfirmState({
      isOpen: true,
      message: `LEAVE ${group.name}?`,
      onConfirm: () => setGroups(groups.filter((g) => g.id !== group.id)),
    });
  };

  return (
    <div className="h-full bg-[var(--color-crazy-blue)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--color-crazy-yellow)] border-b-4 border-black p-4">
        <h2 className="font-black text-2xl uppercase text-center">GROUPS</h2>
      </div>

      {/* Create Group Section */}
      {showCreateSection && (
        <div className="p-4 border-b-4 border-black bg-[var(--color-crazy-pink)]">
          {!showCreateGroup ? (
            <button
              onClick={() => setShowCreateGroup(true)}
              className="w-full bg-[var(--color-crazy-green)] border-4 border-black font-black px-4 py-3 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2"
            >
              <Users size={20} />
              CREATE GROUP
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full border-4 border-black px-3 py-2 font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                style={{ fontFamily: "var(--font-display)" }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateGroup}
                  className="flex-1 bg-[var(--color-crazy-blue)] border-3 border-black font-black px-3 py-2 uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  CREATE
                </button>
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="flex-1 bg-[var(--color-crazy-yellow)] border-3 border-black font-black px-3 py-2 uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="relative">
                  <div className={`w-12 h-12 ${group.avatarColor} border-4 border-black rounded-full flex items-center justify-center`}>
                    <Users size={24} className="font-black" />
                  </div>
                  {group.unread > 0 && (
                    <div className="absolute -top-2 -right-2 bg-black text-white border-2 border-black rounded-full w-6 h-6 flex items-center justify-center font-black text-xs">
                      {group.unread}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg uppercase">{group.name}</h3>
                  <p className="font-bold text-sm flex items-center gap-1">
                    <Users size={14} />
                    {group.members} MEMBERS
                  </p>
                  <p className="font-bold text-xs mt-2 text-gray-700">
                    {group.lastMessage}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onSelectGroup && onSelectGroup(group)}
                  className="bg-[var(--color-crazy-green)] border-3 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
                >
                  <MessageCircle size={18} />
                </button>
                <button
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
        ))}
      </div>

      {/* Stats Footer */}
      <div className="bg-[var(--color-crazy-yellow)] border-t-4 border-black p-4 text-center">
        <p className="font-black uppercase">
          TOTAL GROUPS: {groups.length}
        </p>
        <p className="font-bold text-sm mt-1">
          {groups.reduce((sum, g) => sum + g.unread, 0)} UNREAD MESSAGES
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
