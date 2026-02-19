import React, { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatSection from "../components/ChatSection";
import Friends from "../components/Friends";
import Groups from "../components/Groups";
import CustomAlert from "../components/CustomAlert";

const CONTACTS = [
  { id: "1", name: "Glitchy Gab", username: "glitchygab", avatarColor: "bg-[var(--color-crazy-pink)]", status: "online" },
  { id: "2", name: "Retro Rex", username: "retrorex", avatarColor: "bg-[var(--color-crazy-blue)]", status: "offline" },
  { id: "3", name: "Pixel Pete", username: "pixelpete", avatarColor: "bg-[var(--color-crazy-green)]", status: "online" },
  { id: "4", name: "Vapor Val", username: "vaporval", avatarColor: "bg-[var(--color-crazy-yellow)]", status: "online" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("chat"); // chat, friends, groups
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const handleLogout = () => {
    setConfirmState({
      isOpen: true,
      message: "LEAVE THE CHAOS ZONE?",
      onConfirm: () => navigate("/"),
    });
  };

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
    setActiveView("chat");
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[var(--color-crazy-yellow)]">
      {/* Sidebar - Contact List */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative w-80 h-full bg-[var(--color-crazy-pink)] border-r-4 border-black transition-transform duration-300 z-20 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="bg-[var(--color-crazy-pink)] border-b-4 border-black p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-black italic" style={{ fontFamily: "var(--font-display)" }}>
              YappHere
            </h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden bg-black text-white border-3 border-black p-2"
            >
              <X size={20} />
            </button>
          </div>
          {/* User Profile */}
          <div className="bg-[var(--color-crazy-blue)] border-3 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white border-3 border-black rounded-full flex items-center justify-center font-black">
                <User size={20} />
              </div>
              <div className="flex-1">
                <p className="font-black uppercase">YOUR NAME</p>
                <p className="font-bold text-xs">@username</p>
              </div>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="border-b-4 border-black bg-[var(--color-crazy-pink)] flex">
          <button
            onClick={() => setActiveView("chat")}
            className={`flex-1 font-black uppercase py-3 border-r-2 border-black ${
              activeView === "chat" ? "bg-[var(--color-crazy-yellow)]" : "bg-[var(--color-crazy-pink)]"
            } hover:bg-[var(--color-crazy-yellow)] transition-colors`}
          >
            CHATS
          </button>
          <button
            onClick={() => setActiveView("friends")}
            className={`flex-1 font-black uppercase py-3 border-r-2 border-black ${
              activeView === "friends" ? "bg-[var(--color-crazy-yellow)]" : "bg-[var(--color-crazy-pink)]"
            } hover:bg-[var(--color-crazy-yellow)] transition-colors`}
          >
            FRIENDS
          </button>
          <button
            onClick={() => setActiveView("groups")}
            className={`flex-1 font-black uppercase py-3 ${
              activeView === "groups" ? "bg-[var(--color-crazy-yellow)]" : "bg-[var(--color-crazy-pink)]"
            } hover:bg-[var(--color-crazy-yellow)] transition-colors`}
          >
            GROUPS
          </button>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {CONTACTS.map((contact) => (
            <button
              key={contact.id}
              onClick={() => handleSelectContact(contact)}
              className={`w-full ${
                activeContact.id === contact.id ? "bg-[var(--color-crazy-blue)]" : "bg-white"
              } border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all text-left`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-10 h-10 ${contact.avatarColor} border-3 border-black rounded-full flex items-center justify-center font-black text-xs`}>
                    {contact.name.substring(0, 2).toUpperCase()}
                  </div>
                  {contact.status === "online" && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[var(--color-crazy-green)] border-2 border-black rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-black">{contact.name}</h3>
                  <p className="font-bold text-xs uppercase">
                    {contact.status === "online" ? "ONLINE NOW!" : "LAST SEEN RECENTLY"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Add Friend Button */}
        <div className="p-3 border-t-4 border-black bg-[var(--color-crazy-pink)]">
          <button
            onClick={() => setActiveView("friends")}
            className="w-full bg-[var(--color-crazy-green)] border-4 border-black font-black px-4 py-3 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
          >
            ADD FRIEND +
          </button>
          <button
            onClick={handleLogout}
            className="w-full mt-2 bg-black text-white border-4 border-black font-black px-4 py-2 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            LOGOUT
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Mobile Menu Button */}
        <div className="md:hidden bg-[var(--color-crazy-green)] border-b-4 border-black p-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="bg-black text-white border-3 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeView === "chat" && <ChatSection activeContact={activeContact} />}
          {activeView === "friends" && <Friends onSelectFriend={handleSelectContact} />}
          {activeView === "groups" && <Groups onSelectGroup={handleSelectContact} />}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
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
