import React, { useState } from "react";
import { Users, Camera, UserPlus, X, Search } from "lucide-react";
import CustomAlert from "./CustomAlert";

const FRIENDS_DATA = [
  { id: "1", name: "Glitchy Gab", username: "glitchygab", avatarColor: "bg-[var(--color-crazy-pink)]", status: "online" },
  { id: "2", name: "Retro Rex", username: "retrorex", avatarColor: "bg-[var(--color-crazy-blue)]", status: "offline" },
  { id: "3", name: "Pixel Pete", username: "pixelpete", avatarColor: "bg-[var(--color-crazy-green)]", status: "online" },
  { id: "4", name: "Vapor Val", username: "vaporval", avatarColor: "bg-[var(--color-crazy-yellow)]", status: "online" },
  { id: "5", name: "Neon Nancy", username: "neonnancy", avatarColor: "bg-[var(--color-crazy-pink)]", status: "offline" },
  { id: "6", name: "Digital Dan", username: "digitaldan", avatarColor: "bg-[var(--color-crazy-blue)]", status: "online" },
];

const CreateGroupForm = () => {
  const [newGroupName, setNewGroupName] = useState("");
  const [groupPhoto, setGroupPhoto] = useState(null);
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchMember, setSearchMember] = useState("");
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: "",
    type: "alert",
    onConfirm: null,
  });

  const filteredFriends = FRIENDS_DATA.filter(friend =>
    friend.name.toLowerCase().includes(searchMember.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchMember.toLowerCase())
  );

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

  const toggleMember = (member) => {
    if (selectedMembers.find(m => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      setAlertState({
        isOpen: true,
        message: `GROUP "${newGroupName.toUpperCase()}" CREATED WITH ${selectedMembers.length} MEMBERS!`,
        type: "alert",
        onConfirm: null,
      });
      setNewGroupName("");
      setGroupPhoto(null);
      setGroupDescription("");
      setSelectedMembers([]);
    }
  };

  return (
    <div className="h-full bg-[var(--color-crazy-blue)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--color-crazy-yellow)] border-b-4 border-black p-4">
        <h2 className="font-black text-2xl uppercase text-center">CREATE GROUP</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="bg-white border-6 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-full max-w-3xl mx-auto p-8">
          <div className="space-y-6">
            {/* Group Photo */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {groupPhoto ? (
                  <img
                    src={groupPhoto}
                    alt="Group"
                    className="w-32 h-32 border-6 border-black rounded-full object-cover shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  />
                ) : (
                  <div className="w-32 h-32 bg-[var(--color-crazy-pink)] border-6 border-black rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
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
              <p className="text-sm font-bold uppercase">Add Group Photo</p>
            </div>

            {/* Group Name */}
            <div>
              <label className="block font-black text-lg mb-3 uppercase">Group Name</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full border-4 border-black px-4 py-4 text-lg font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
                style={{ fontFamily: "var(--font-display)" }}
              />
            </div>

            {/* Group Description */}
            <div>
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

            {/* Add Members */}
            <div>
              <label className="block font-black text-lg mb-3 uppercase">Add Members ({selectedMembers.length})</label>
              {/* Search Input */}
              <div className="relative flex items-center mb-3">
                <Search className="absolute left-3 pointer-events-none" size={20} />
                <input
                  type="text"
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  placeholder="Search friends..."
                  className="w-full border-4 border-black pl-12 pr-4 py-3 font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ fontFamily: "var(--font-display)" }}
                />
              </div>
              <div className="border-4 border-black p-4 bg-[var(--color-crazy-yellow)] max-h-64 overflow-y-auto space-y-2">
                {filteredFriends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => toggleMember(friend)}
                    className={`w-full ${
                      selectedMembers.find(m => m.id === friend.id)
                        ? "bg-[var(--color-crazy-green)]"
                        : "bg-white"
                    } border-3 border-black p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-left flex items-center justify-between`}
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
                    {selectedMembers.find(m => m.id === friend.id) && (
                      <UserPlus size={18} className="font-black" />
                    )}
                  </button>
                ))}
                {filteredFriends.length === 0 && (
                  <p className="text-center font-bold py-4 uppercase">No friends found</p>
                )}
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateGroup}
              className="w-full bg-[var(--color-crazy-green)] border-4 border-black font-black px-6 py-4 text-xl uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-3"
            >
              <Users size={24} />
              CREATE GROUP
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
  );
};

export default CreateGroupForm;
