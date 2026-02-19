import React, { useState } from "react";
import { LogOut, User, Camera, Edit2, Save, MessageCircle, Users, UserPlus, FolderPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatSection from "../components/ChatSection";
import ChatList from "../components/ChatList";
import Friends from "../components/Friends";
import Groups from "../components/Groups";
import Profile from "../components/Profile";
import AddFriendForm from "../components/AddFriendForm";
import CreateGroupForm from "../components/CreateGroupForm";
import CustomAlert from "../components/CustomAlert";

const CONTACTS = [
  { id: "1", name: "Glitchy Gab", username: "glitchygab", avatarColor: "bg-[var(--color-crazy-pink)]", status: "online" },
  { id: "2", name: "Retro Rex", username: "retrorex", avatarColor: "bg-[var(--color-crazy-blue)]", status: "offline" },
  { id: "3", name: "Pixel Pete", username: "pixelpete", avatarColor: "bg-[var(--color-crazy-green)]", status: "online" },
  { id: "4", name: "Vapor Val", username: "vaporval", avatarColor: "bg-[var(--color-crazy-yellow)]", status: "online" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("chatList"); // chatList, chat, friends, groups, profile, addFriend, createGroup
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);
  const [profileData, setProfileData] = useState({
    name: "YOUR NAME",
    username: "username",
    photo: null,
  });
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const handleLogout = () => {
    setConfirmState({
      isOpen: true,
      message: "DO U WANT TO LOGOUT?",
      onConfirm: () => navigate("/"),
    });
  };

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
    setActiveView("chat");
  };

  const handleSaveProfile = (newProfileData) => {
    setProfileData(newProfileData);
  };

  const handleMenuClick = (view) => {
    setActiveView(view);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[var(--color-crazy-yellow)]">
      {/* Sidebar - Menu */}
      <div className="w-80 h-full bg-[var(--color-crazy-pink)] border-r-4 border-black flex flex-col">
        {/* Sidebar Header */}
        <div className="bg-[var(--color-crazy-pink)] border-b-4 border-black p-4">
          <h1 className="text-3xl font-black italic text-center" style={{ fontFamily: "'Betania Patmos In', cursive" }}>
            YappHere
          </h1>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <button
            onClick={() => handleMenuClick("chatList")}
            className={`w-full ${
              activeView === "chatList" || activeView === "chat" ? "bg-[var(--color-crazy-yellow)]" : "bg-white"
            } border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all text-left font-black uppercase flex items-center gap-3`}
          >
            <MessageCircle size={20} />
            CHATS
          </button>

          <button
            onClick={() => handleMenuClick("friends")}
            className={`w-full ${
              activeView === "friends" ? "bg-[var(--color-crazy-yellow)]" : "bg-white"
            } border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all text-left font-black uppercase flex items-center gap-3`}
          >
            <Users size={20} />
            FRIENDS
          </button>

          <button
            onClick={() => handleMenuClick("groups")}
            className={`w-full ${
              activeView === "groups" ? "bg-[var(--color-crazy-yellow)]" : "bg-white"
            } border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all text-left font-black uppercase flex items-center gap-3`}
          >
            <FolderPlus size={20} />
            GROUPS
          </button>

          <button
            onClick={() => handleMenuClick("profile")}
            className={`w-full ${
              activeView === "profile" ? "bg-[var(--color-crazy-yellow)]" : "bg-white"
            } border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all text-left font-black uppercase flex items-center gap-3`}
          >
            <User size={20} />
            PROFILE
          </button>

          <button
            onClick={() => handleMenuClick("addFriend")}
            className={`w-full ${
              activeView === "addFriend" ? "bg-[var(--color-crazy-yellow)]" : "bg-[var(--color-crazy-green)]"
            } border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all text-left font-black uppercase flex items-center gap-3`}
          >
            <UserPlus size={20} />
            ADD FRIEND
          </button>

          <button
            onClick={() => handleMenuClick("createGroup")}
            className={`w-full ${
              activeView === "createGroup" ? "bg-[var(--color-crazy-yellow)]" : "bg-[var(--color-crazy-blue)]"
            } border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all text-left font-black uppercase flex items-center gap-3`}
          >
            <FolderPlus size={20} />
            CREATE GROUP
          </button>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t-4 border-black bg-[var(--color-crazy-pink)]">
          <button
            onClick={handleLogout}
            className="w-full bg-black text-white border-4 border-black font-black px-4 py-3 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            LOGOUT
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeView === "chatList" && <ChatList onSelectChat={handleSelectContact} />}
          {activeView === "chat" && <ChatSection activeContact={activeContact} />}
          {activeView === "friends" && <Friends onSelectFriend={handleSelectContact} showAddSection={false} />}
          {activeView === "groups" && <Groups onSelectGroup={handleSelectContact} showCreateSection={false} />}
          {activeView === "profile" && <Profile profileData={profileData} onSave={handleSaveProfile} />}
          {activeView === "addFriend" && <AddFriendForm />}
          {activeView === "createGroup" && <CreateGroupForm />}
        </div>
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

export default Dashboard;
