"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft } from "lucide-react";

import { useChatStore } from "../features/chat/store/ChatStore";
import { socketClient } from "../core/socket/socketClient";

const ChatSection = ({ onBack }) => {
  const selectedConversation = useChatStore(
    (s) => s.selectedConversation
  );

  const messages = useChatStore((s) => s.messages);

  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full font-black">
        SELECT A CHAT
      </div>
    );
  }

  const conversationId =
    selectedConversation.id ||
    selectedConversation._id ||
    selectedConversation.ID;

  const conversationMessages =
    messages[conversationId] || [];

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [conversationMessages]);


  const handleSend = () => {
    if (!inputValue.trim()) return;

    socketClient.send({
      conversation_id: conversationId,
      content: inputValue,
    });

    // Optimistic render: show the message instantly for the sender
    const addMessage = useChatStore.getState().addMessage;
    addMessage(conversationId, {
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: inputValue,
      created_at: new Date().toISOString(),
    });

    setInputValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-crazy-green)]">

      {/* HEADER */}
      <div className="bg-[var(--color-crazy-green)] border-b-4 border-black p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack}>
              <ArrowLeft size={20} />
            </button>
          )}

          <div className="w-12 h-12 bg-[var(--color-crazy-blue)] border-4 border-black rounded-full flex items-center justify-center font-black text-sm">
            {(selectedConversation.display_name ||
              selectedConversation.username ||
              "??"
            )
              .substring(0, 2)
              .toUpperCase()}
          </div>

          <div>
            <h2 className="font-black text-xl uppercase">
              {selectedConversation.display_name ||
                selectedConversation.username}
            </h2>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.map((msg, index) => {
          const isMe =
            msg.sender_id === currentUserId;

          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"
                }`}
            >
              <div className="max-w-[70%]">
                <div
                  className={`${isMe
                    ? "bg-[var(--color-crazy-blue)]"
                    : "bg-white"
                    } border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <p className="font-bold break-words">
                    {msg.content}
                  </p>

                  <div className="flex justify-end mt-2">
                    <span className="text-xs font-bold opacity-70">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="border-t-4 border-black p-4 bg-[var(--color-crazy-green)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) =>
              setInputValue(e.target.value)
            }
            onKeyDown={handleKeyPress}
            placeholder="Type something ..."
            className="flex-1 border-4 border-black px-4 py-3 font-bold bg-white"
          />

          <button
            onClick={handleSend}
            className="bg-black text-white border-4 border-black p-3"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;