"use client";

import React, { useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import { useChatStore } from "../store/ChatStore";
import chatService from "../services/ChatService";

const ChatList = ({ onSelectChat }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const conversations = useChatStore((s) => s.conversations);
  const setSelectedConversation = useChatStore(
    (s) => s.setSelectedConversation
  );
  const setMessages = useChatStore((s) => s.setMessages);

  const handleSelect = async (conversation) => {
    const conversationId = conversation.id || conversation._id || conversation.ID;

    setSelectedConversation(conversation);

    try {
      const messages = await chatService.fetchMessages(conversationId);
      setMessages(conversationId, messages);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }

    if (onSelectChat) onSelectChat(conversation);
  };

  const filteredConversations = conversations.filter((conv) => {
    const name =
      conv.name ||
      conv.display_name ||
      conv.ID ||
      conv._id ||
      conv.id ||
      "";

    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const currentUserId = localStorage.getItem("user_id");

  // For a direct conversation, return the other participant's info.
  // For group conversations, return null (use conv.name instead).
  const getOtherParticipant = (conv) => {
    if (conv.type !== "direct") return null;
    const infos = conv.participant_infos || [];
    return infos.find((p) => p.id !== currentUserId) || infos[0] || null;
  };

  return (
    <div className="h-full bg-[var(--color-crazy-yellow)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--color-crazy-pink)] border-b-4 border-black p-4">
        <h2 className="font-black text-2xl uppercase text-center">
          ALL CHATS
        </h2>
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
        {filteredConversations.map((conv, idx) => {
          const conversationId = conv.id || conv._id || conv.ID;
          const otherParticipant = getOtherParticipant(conv);
          const name =
            conv.type === "direct"
              ? (otherParticipant?.display_name || otherParticipant?.username || conv.display_name || conv.name || conversationId)
              : (conv.name || conv.display_name || conversationId);
          const photoUrl = conv.type === "direct"
            ? (otherParticipant?.photo_url || null)
            : (conv.group_photo || null);

          return (
            <button
              key={conversationId || idx}
              onClick={() => handleSelect(conv)}
              className="w-full bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <div className="w-12 h-12 bg-[var(--color-crazy-blue)] border-4 border-black rounded-full flex items-center justify-center font-black text-sm overflow-hidden">
                      {photoUrl ? (
                        <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        name?.substring(0, 2).toUpperCase() || "??"
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg">{name}</h3>
                    {conv.last_message ? (
                      <p className="font-bold text-xs mt-1 truncate opacity-70">
                        {conv.last_message.content}
                      </p>
                    ) : (
                      <p className="font-bold text-xs mt-1 truncate opacity-50">
                        No messages yet
                      </p>
                    )}
                  </div>
                </div>
                <MessageCircle size={20} />
              </div>
            </button>
          );
        })}

        {filteredConversations.length === 0 && (
          <div className="bg-white border-4 border-black p-8 text-center">
            <p className="font-black text-lg uppercase">
              NO CHATS FOUND
            </p>
            <p className="font-bold text-sm mt-2">
              Try a different search term
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-[var(--color-crazy-pink)] border-t-4 border-black p-4 text-center">
        <p className="font-black uppercase">
          {searchQuery
            ? `SHOWING: ${filteredConversations.length} / ${conversations.length}`
            : `TOTAL CHATS: ${conversations.length}`}
        </p>
      </div>
    </div>
  );
};

export default ChatList;