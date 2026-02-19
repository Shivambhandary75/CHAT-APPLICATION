import React, { useState } from "react";
import { UserPlus, MessageCircle, UserMinus } from "lucide-react";
import CustomAlert from "./CustomAlert";

const FRIENDS_DATA = [
  { id: "1", name: "Glitchy Gab", username: "glitchygab", avatarColor: "bg-[var(--color-crazy-pink)]", status: "online" },
  { id: "2", name: "Retro Rex", username: "retrorex", avatarColor: "bg-[var(--color-crazy-blue)]", status: "offline" },
  { id: "3", name: "Pixel Pete", username: "pixelpete", avatarColor: "bg-[var(--color-crazy-green)]", status: "online" },
  { id: "4", name: "Vapor Val", username: "vaporval", avatarColor: "bg-[var(--color-crazy-yellow)]", status: "online" },
  { id: "5", name: "Neon Nancy", username: "neonnancy", avatarColor: "bg-[var(--color-crazy-pink)]", status: "offline" },
  { id: "6", name: "Digital Dan", username: "digitaldan", avatarColor: "bg-[var(--color-crazy-blue)]", status: "online" },
];

const Friends = ({ onSelectFriend, showAddSection = true }) => {
  const [friends, setFriends] = useState(FRIENDS_DATA);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendUsername, setNewFriendUsername] = useState("");
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: "",
    type: "alert",
    onConfirm: null,
  });

  const handleAddFriend = () => {
    if (newFriendUsername.trim()) {
      setAlertState({
        isOpen: true,
        message: `FRIEND REQUEST SENT TO ${newFriendUsername.toUpperCase()}!`,
        type: "alert",
        onConfirm: null,
      });
      setNewFriendUsername("");
      setShowAddFriend(false);
    }
  };

  const handleRemoveFriend = (friend) => {
    setAlertState({
      isOpen: true,
      message: `REMOVE ${friend.name.toUpperCase()} FROM YOUR FRIENDS?`,
      type: "confirm",
      onConfirm: () => setFriends(friends.filter((f) => f.id !== friend.id)),
    });
  };

  return (
    <div className="h-full bg-[var(--color-crazy-yellow)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--color-crazy-pink)] border-b-4 border-black p-4">
        <h2 className="font-black text-2xl uppercase text-center">FRIENDS</h2>
      </div>

      {/* Add Friend Section */}
      {showAddSection && (
        <div className="p-4 border-b-4 border-black bg-[var(--color-crazy-green)]">
          {!showAddFriend ? (
            <button
              onClick={() => setShowAddFriend(true)}
              className="w-full bg-[var(--color-crazy-green)] border-4 border-black font-black px-4 py-3 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              ADD FRIEND
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={newFriendUsername}
                onChange={(e) => setNewFriendUsername(e.target.value)}
                placeholder="Enter username..."
                className="w-full border-4 border-black px-3 py-2 font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
                style={{ fontFamily: "var(--font-display)" }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddFriend}
                  className="flex-1 bg-[var(--color-crazy-blue)] border-3 border-black font-black px-3 py-2 uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  SEND
                </button>
                <button
                  onClick={() => setShowAddFriend(false)}
                  className="flex-1 bg-[var(--color-crazy-pink)] border-3 border-black font-black px-3 py-2 uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <div className={`w-12 h-12 ${friend.avatarColor} border-4 border-black rounded-full flex items-center justify-center font-black text-sm`}>
                    {friend.name.substring(0, 2).toUpperCase()}
                  </div>
                  {friend.status === "online" && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-crazy-green)] border-2 border-black rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg">{friend.name}</h3>
                  <p className="font-bold text-sm">@{friend.username}</p>
                  <p className="font-bold text-xs uppercase mt-1">
                    {friend.status === "online" ? "ONLINE NOW!" : "LAST SEEN RECENTLY"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onSelectFriend && onSelectFriend(friend)}
                  className="bg-[var(--color-crazy-blue)] border-3 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
                >
                  <MessageCircle size={18} />
                </button>
                <button
                  onClick={() => handleRemoveFriend(friend)}
                  className="bg-[var(--color-crazy-pink)] border-3 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
                >
                  <UserMinus size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="bg-[var(--color-crazy-pink)] border-t-4 border-black p-4 text-center">
        <p className="font-black uppercase">
          TOTAL FRIENDS: {friends.length}
        </p>
        <p className="font-bold text-sm mt-1">
          {friends.filter((f) => f.status === "online").length} ONLINE
        </p>
      </div>
    </div>
  );
};

export default Friends;
