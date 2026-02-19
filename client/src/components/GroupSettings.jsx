import React, { useState } from "react";
import { Users, Camera, UserPlus, X, Save, Trash2 } from "lucide-react";
import CustomAlert from "./CustomAlert";

const FRIENDS_DATA = [
  { id: "1", name: "Glitchy Gab", username: "glitchygab", avatarColor: "bg-[var(--color-crazy-pink)]", status: "online" },
  { id: "2", name: "Retro Rex", username: "retrorex", avatarColor: "bg-[var(--color-crazy-blue)]", status: "offline" },
  { id: "3", name: "Pixel Pete", username: "pixelpete", avatarColor: "bg-[var(--color-crazy-green)]", status: "online" },
  { id: "4", name: "Vapor Val", username: "vaporval", avatarColor: "bg-[var(--color-crazy-yellow)]", status: "online" },
  { id: "5", name: "Neon Nancy", username: "neonnancy", avatarColor: "bg-[var(--color-crazy-pink)]", status: "offline" },
  { id: "6", name: "Digital Dan", username: "digitaldan", avatarColor: "bg-[var(--color-crazy-blue)]", status: "online" },
];

const GroupSettings = ({ group, onSave, onClose }) => {
  // Initialize with demo members if group.members is just a number
  const initialMembers = Array.isArray(group.members) 
    ? group.members 
    : [
        FRIENDS_DATA[0], // Glitchy Gab
        FRIENDS_DATA[2], // Pixel Pete
      ];

  const [groupName, setGroupName] = useState(group.name);
  const [groupPhoto, setGroupPhoto] = useState(group.photo || null);
  const [groupDescription, setGroupDescription] = useState(group.description || "");
  const [groupMembers, setGroupMembers] = useState(initialMembers);
  const [searchMember, setSearchMember] = useState("");
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: "",
    type: "alert",
    onConfirm: null,
  });

  if (!group) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addMember = (member) => {
    if (!groupMembers.find(m => m.id === member.id)) {
      setGroupMembers([...groupMembers, member]);
    }
  };

  const removeMember = (memberId) => {
    setAlertState({
      isOpen: true,
      message: "REMOVE THIS MEMBER FROM GROUP?",
      type: "confirm",
      onConfirm: () => setGroupMembers(groupMembers.filter(m => m.id !== memberId)),
    });
  };

  const handleSave = () => {
    const updatedGroup = {
      ...group,
      name: groupName,
      photo: groupPhoto,
      description: groupDescription,
      members: groupMembers.length, // Save as count for display
      membersList: groupMembers, // Save actual member data
    };
    onSave(updatedGroup);
    setAlertState({
      isOpen: true,
      message: "GROUP SETTINGS SAVED!",
      type: "alert",
      onConfirm: null,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Modal Container */}
      <div className="bg-white border-6 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[var(--color-crazy-yellow)] border-b-4 border-black p-4 flex items-center justify-between">
          <h2 className="font-black text-2xl uppercase text-center flex-1">GROUP SETTINGS</h2>
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
                  <img
                    src={groupPhoto}
                    alt="Group"
                    className="w-32 h-32 border-6 border-black rounded-full object-cover shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  />
                ) : (
                  <div className={`w-32 h-32 ${group.avatarColor || "bg-[var(--color-crazy-pink)]"} border-6 border-black rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
                    <Users size={60} className="font-black" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-[var(--color-crazy-blue)] border-4 border-black rounded-full p-3 cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <Camera size={24} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
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
                className="w-full border-4 border-black px-4 py-4 text-lg font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
                style={{ fontFamily: "var(--font-display)" }}
              />
            </div>

            {/* Group Description */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <label className="block font-black text-lg mb-3 uppercase">Description</label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Enter group description..."
                rows={3}
                className="w-full border-4 border-black px-4 py-3 text-base font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all resize-none"
                style={{ fontFamily: "var(--font-display)" }}
              />
            </div>

            {/* Current Members */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <label className="block font-black text-lg mb-3 uppercase">Current Members ({groupMembers.length})</label>
              <div className="border-4 border-black p-4 bg-[var(--color-crazy-pink)] max-h-48 overflow-y-auto space-y-2">
                {groupMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white border-3 border-black p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${member.avatarColor} border-3 border-black rounded-full flex items-center justify-center font-black text-xs`}>
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black">{member.name}</p>
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
                ))}
              </div>
            </div>

            {/* Add Members */}
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <label className="block font-black text-lg mb-3 uppercase">Add Members</label>
              {/* Search Input */}
              <input
                type="text"
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                placeholder="Search friends..."
                className="w-full border-4 border-black px-4 py-3 font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              />
              <div className="border-4 border-black p-4 bg-[var(--color-crazy-yellow)] max-h-48 overflow-y-auto space-y-2">
                {FRIENDS_DATA
                  .filter(f => !groupMembers.find(m => m.id === f.id))
                  .filter(f => 
                    f.name.toLowerCase().includes(searchMember.toLowerCase()) ||
                    f.username.toLowerCase().includes(searchMember.toLowerCase())
                  )
                  .map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => addMember(friend)}
                    className="w-full bg-white border-3 border-black p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:bg-[var(--color-crazy-green)] active:scale-95 transition-all text-left flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${friend.avatarColor} border-3 border-black rounded-full flex items-center justify-center font-black text-xs`}>
                        {friend.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black">{friend.name}</p>
                        <p className="font-bold text-xs">@{friend.username}</p>
                      </div>
                    </div>
                    <UserPlus size={18} className="font-black" />
                  </button>
                ))}
                {FRIENDS_DATA
                  .filter(f => !groupMembers.find(m => m.id === f.id))
                  .filter(f => 
                    f.name.toLowerCase().includes(searchMember.toLowerCase()) ||
                    f.username.toLowerCase().includes(searchMember.toLowerCase())
                  ).length === 0 && (
                  <p className="text-center font-bold py-4 uppercase">No friends found</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-[var(--color-crazy-green)] border-4 border-black font-black px-6 py-4 text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-3"
              >
                <Save size={24} />
                SAVE CHANGES
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-[var(--color-crazy-pink)] border-4 border-black font-black px-6 py-4 text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>

        {/* Custom Alert */}
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
