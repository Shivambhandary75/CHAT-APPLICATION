import React, { useState } from "react";
import { MessageCircle, Search } from "lucide-react";

const CONTACTS = [
  { id: "1", name: "Glitchy Gab", username: "glitchygab", avatarColor: "bg-[var(--color-crazy-pink)]", status: "online", lastMessage: "WELCOME TO YAPPHERE!", unread: 3 },
  { id: "2", name: "Retro Rex", username: "retrorex", avatarColor: "bg-[var(--color-crazy-blue)]", status: "offline", lastMessage: "See you later!", unread: 0 },
  { id: "3", name: "Pixel Pete", username: "pixelpete", avatarColor: "bg-[var(--color-crazy-green)]", status: "online", lastMessage: "8-BIT VIBES!", unread: 5 },
  { id: "4", name: "Vapor Val", username: "vaporval", avatarColor: "bg-[var(--color-crazy-yellow)]", status: "online", lastMessage: "AESTHETIC OVERLOAD", unread: 1 },
  { id: "5", name: "Neon Nancy", username: "neonnancy", avatarColor: "bg-[var(--color-crazy-pink)]", status: "offline", lastMessage: "Goodnight!", unread: 0 },
  { id: "6", name: "Digital Dan", username: "digitaldan", avatarColor: "bg-[var(--color-crazy-blue)]", status: "online", lastMessage: "Let's chat later", unread: 2 },
];

const ChatList = ({ onSelectChat }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = CONTACTS.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-[var(--color-crazy-yellow)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--color-crazy-pink)] border-b-4 border-black p-4">
        <h2 className="font-black text-2xl uppercase text-center">ALL CHATS</h2>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b-4 border-black bg-[var(--color-crazy-green)]">
        <div className="relative flex items-center">
          <Search className="absolute left-3 pointer-events-none" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className="w-full border-4 border-black pl-12 pr-4 py-3 font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ fontFamily: "var(--font-display)" }}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredContacts.map((contact) => (
          <button
            key={contact.id}
            onClick={() => onSelectChat && onSelectChat(contact)}
            className="w-full bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <div className={`w-12 h-12 ${contact.avatarColor} border-4 border-black rounded-full flex items-center justify-center font-black text-sm`}>
                    {contact.name.substring(0, 2).toUpperCase()}
                  </div>
                  {contact.status === "online" && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-crazy-green)] border-2 border-black rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg">{contact.name}</h3>
                  <p className="font-bold text-sm">@{contact.username}</p>
                  <p className="font-bold text-xs mt-1 truncate">{contact.lastMessage}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {contact.unread > 0 && (
                  <div className="bg-[var(--color-crazy-pink)] border-3 border-black rounded-full w-8 h-8 flex items-center justify-center font-black text-sm">
                    {contact.unread}
                  </div>
                )}
                <MessageCircle size={20} />
              </div>
            </div>
          </button>
        ))}
        {filteredContacts.length === 0 && (
          <div className="bg-white border-4 border-black p-8 text-center">
            <p className="font-black text-lg uppercase">NO CHATS FOUND</p>
            <p className="font-bold text-sm mt-2">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-[var(--color-crazy-pink)] border-t-4 border-black p-4 text-center">
        <p className="font-black uppercase">
          {searchQuery ? `SHOWING: ${filteredContacts.length} / ${CONTACTS.length}` : `TOTAL CHATS: ${CONTACTS.length}`}
        </p>
        <p className="font-bold text-sm mt-1">
          {filteredContacts.filter((c) => c.status === "online").length} ONLINE
        </p>
      </div>
    </div>
  );
};

export default ChatList;
