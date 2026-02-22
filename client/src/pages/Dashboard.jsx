import React, { useState, useEffect } from "react";
import { LogOut, User, MessageCircle, Users, UserPlus, FolderPlus, Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatSection from "../components/ChatSection";
import ChatList from "../components/ChatList";
import Friends from "../components/Friends";
import Groups from "../components/Groups";
import Profile from "../components/Profile";
import AddFriendForm from "../components/AddFriendForm";
import GroupSettings from "../components/GroupSettings";
import Requests from "../components/Requests";
import CustomAlert from "../components/CustomAlert";
import { logoutUser, getProfile } from "../api/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("chatList");
  const [activeContact, setActiveContact] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    photo: null,
  });
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfileData({
          name: data.display_name || "",
          username: data.username || "",
          photo: null,
        });
      })
      .catch((err) => console.error("Failed to load profile:", err));
  }, []);

  const handleLogout = () => {
    setConfirmState({
      isOpen: true,
      message: "DO U WANT TO LOGOUT?",
      onConfirm: async () => {
        try {
          await logoutUser();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          // Navigate to login even if logout fails (token will be cleared)
          navigate("/login");
        }
      },
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

  const handleGroupSettings = (group) => {
    setSelectedGroup(group);
    setShowGroupSettings(true);
  };

  const handleBackToChat = () => {
    setActiveView("chatList");
  };

  const handleSaveGroup = (updatedGroup) => {
    // In a real app, this would update the backend
    console.log("Group updated:", updatedGroup);
    setShowGroupSettings(false);
  };

  const handleCloseGroupSettings = () => {
    setShowGroupSettings(false);
    setSelectedGroup(null);
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
            onClick={() => handleMenuClick("requests")}
            className={`w-full ${
              activeView === "requests" ? "bg-[var(--color-crazy-yellow)]" : "bg-white"
            } border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all text-left font-black uppercase flex items-center gap-3`}
          >
            <Inbox size={20} />
            REQUESTS
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
          {activeView === "chat" && <ChatSection activeContact={activeContact} onBack={handleBackToChat} />}
          {activeView === "friends" && <Friends onSelectFriend={handleSelectContact} showAddSection={false} />}
          {activeView === "requests" && <Requests />}
          {activeView === "groups" && <Groups onSelectGroup={handleSelectContact} onGroupSettings={handleGroupSettings} />}
          {activeView === "profile" && <Profile profileData={profileData} onSave={handleSaveProfile} />}
          {activeView === "addFriend" && <AddFriendForm />}
        </div>
      </div>

      {/* Group Settings Modal */}
      {showGroupSettings && selectedGroup && (
        <GroupSettings 
          group={selectedGroup} 
          onSave={handleSaveGroup} 
          onClose={handleCloseGroupSettings} 
        />
      )}

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
