"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Smile, Paperclip, X, FileText, Trash2, Copy, Check, CheckCheck } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

import { useChatStore } from "../store/ChatStore";
import { socketClient } from "../../../core/socket/socketClient";
import http from "../../../core/api/httpClient";
import chatService from "../services/ChatService";

const ChatSection = ({ onBack }) => {
  const selectedConversation = useChatStore(
    (s) => s.selectedConversation
  );

  const messages = useChatStore((s) => s.messages);
  const typingUsers = useChatStore((s) => s.typingUsers);
  const onlineUsers = useChatStore((s) => s.onlineUsers);

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

  const conversationMessages = messages[conversationId] || [];

  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState(null); // { url, type, name }
  const [uploading, setUploading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const emojiRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  // Send read receipt only once when the conversation is opened
  useEffect(() => {
    if (conversationId) {
      useChatStore.getState().markConversationRead(conversationId);
      socketClient.send({
        type: "read",
        conversation_id: conversationId,
      });
    }
  }, [conversationId]);

  // Determine the other user's ID for online status
  const otherUserId = selectedConversation.participants?.find(p => p !== currentUserId) || null;

  // Upload file → server → Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await http.post("/upload/attachment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPendingAttachment({ url: data.url, type: data.type, name: file.name });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSend = () => {
    if (!inputValue.trim() && !pendingAttachment) return;

    const attachmentUrl = pendingAttachment?.url || "";
    const attachmentType = pendingAttachment?.type || "";

    socketClient.send({
      type: "chat_message",
      conversation_id: conversationId,
      content: inputValue,
      attachment_url: attachmentUrl,
      attachment_type: attachmentType,
    });

    // Optimistic render
    const addMessage = useChatStore.getState().addMessage;
    addMessage(conversationId, {
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: inputValue,
      attachment_url: attachmentUrl,
      attachment_type: attachmentType,
      created_at: new Date().toISOString(),
    });

    setInputValue("");
    setPendingAttachment(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const typingTimeoutRef = useRef(null);
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (!typingTimeoutRef.current) {
        socketClient.send({
            type: "typing",
            conversation_id: conversationId,
        });
        typingTimeoutRef.current = setTimeout(() => {
            typingTimeoutRef.current = null;
        }, 1000);
    }
  };

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = async () => {
    setClearing(true);
    try {
      await chatService.clearChat(conversationId);
      useChatStore.getState().clearMessages(conversationId);
    } catch (err) {
      console.error("Failed to clear chat:", err);
      alert("Failed to clear chat. Please try again.");
    } finally {
      setClearing(false);
      setShowClearConfirm(false);
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

  const renderAttachment = (msg) => {
    if (!msg.attachment_url) return null;
    if (msg.attachment_type === "image") {
      return (
        <a href={msg.attachment_url} target="_blank" rel="noreferrer">
          <img
            src={msg.attachment_url}
            alt="attachment"
            className="max-w-full max-h-48 border-2 border-black mt-2 object-cover cursor-pointer"
          />
        </a>
      );
    }
    if (msg.attachment_type === "video") {
      return (
        <video
          src={msg.attachment_url}
          controls
          className="max-w-full max-h-48 border-2 border-black mt-2"
        />
      );
    }
    if (msg.attachment_type === "pdf") {
      // PDFs are stored as raw on Cloudinary.
      // Inject fl_inline into the /raw/upload/ path so the browser renders
      // it inline instead of downloading.
      const inlineUrl = msg.attachment_url.replace("/raw/upload/", "/raw/upload/fl_inline/");
      return (
        <a
          href={inlineUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 mt-2 bg-white border-2 border-black px-3 py-2 font-bold text-sm hover:bg-yellow-100"
        >
          <FileText size={18} />
          Open PDF
        </a>
      );
    }
    // raw → other document
    return (
      <a
        href={msg.attachment_url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 mt-2 bg-white border-2 border-black px-3 py-2 font-bold text-sm hover:bg-yellow-100"
      >
        <FileText size={18} />
        Open file
      </a>
    );
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

          <div className="w-12 h-12 bg-[var(--color-crazy-blue)] border-4 border-black rounded-full flex items-center justify-center font-black text-sm overflow-hidden">
            {(selectedConversation.photo_url || selectedConversation.profile_image || selectedConversation.avatar_url) ? (
              <img
                src={selectedConversation.photo_url || selectedConversation.profile_image || selectedConversation.avatar_url}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              (selectedConversation.name ||
                selectedConversation.display_name ||
                selectedConversation.username ||
                "??"
              )
                .substring(0, 2)
                .toUpperCase()
            )}
          </div>

          <div>
            <h2 className="font-black text-xl uppercase leading-tight flex items-center">
              {selectedConversation.name ||
                selectedConversation.display_name ||
                selectedConversation.username ||
                "Unknown"}
              {selectedConversation.type !== "group" && otherUserId && onlineUsers[otherUserId] && (
                <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-black ml-2 animate-pulse" title="Online"></div>
              )}
            </h2>
            {selectedConversation.username && selectedConversation.type !== "group" && (
              <p className="font-bold text-xs opacity-80 uppercase">
                @{selectedConversation.username} 
                {otherUserId && onlineUsers[otherUserId] ? " • Online" : ""}
              </p>
            )}
            {selectedConversation.type === "group" && selectedConversation.members && (
              <p className="font-bold text-xs opacity-80 uppercase">
                {selectedConversation.members.length} MEMBERS
              </p>
            )}
          </div>
        </div>

        {/* Clear Chat button */}
        <button
          onClick={() => setShowClearConfirm(true)}
          title="Clear chat"
          className="border-4 border-black bg-red-400 hover:bg-red-500 p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Clear Chat Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--color-crazy-green)] border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full mx-4">
            <h3 className="font-black text-xl uppercase mb-2">Clear Chat?</h3>
            <p className="font-bold text-sm mb-6">
              All messages in this conversation will be permanently deleted for  you only and will still be visible to other the user. This cannot be undone!!!
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClearChat}
                disabled={clearing}
                className="flex-1 bg-red-400 border-4 border-black py-2 font-black uppercase hover:bg-red-500 disabled:opacity-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
              >
                {clearing ? "Clearing..." : "Yes, Clear"}
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                disabled={clearing}
                className="flex-1 bg-white border-4 border-black py-2 font-black uppercase hover:bg-gray-100 disabled:opacity-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.map((msg, index) => {
          const isMe = msg.sender_id === currentUserId;

          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                {!isMe && msg.sender && (
                  <div className="w-8 h-8 rounded-full border-2 border-black flex-shrink-0 overflow-hidden bg-[var(--color-crazy-pink)] flex items-center justify-center mt-4">
                    {msg.sender.photo_url ? (
                      <img src={msg.sender.photo_url} className="w-full h-full object-cover" alt="Avatar" />
                    ) : (
                      <span className="text-[10px] font-black">
                        {(msg.sender.display_name || msg.sender.username || "?").substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex flex-col max-w-full group/msg">
                  {!isMe && msg.sender && (
                    <span className="text-[10px] font-black uppercase mb-1 opacity-70 ml-1">
                      {msg.sender.display_name || msg.sender.username}
                    </span>
                  )}
                  <div className={`flex ${isMe ? "flex-row-reverse" : "flex-row"} items-center gap-2`}>
                    <div
                      className={`${
                        isMe ? "bg-[var(--color-crazy-blue)] rounded-bl-xl rounded-tl-xl rounded-tr-xl" : "bg-white rounded-br-xl rounded-tr-xl rounded-tl-xl"
                      } border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] break-words transition-transform hover:-translate-y-0.5 hover:-translate-x-0.5`}
                      style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    >
                      {msg.content && (
                        <p className="font-bold">{msg.content}</p>
                      )}

                      {renderAttachment(msg)}

                    <div className="flex justify-end items-center gap-1 mt-1">
                        <span className="text-[10px] font-bold opacity-70 whitespace-nowrap">
                          {formatTime(msg.created_at)}
                        </span>
                        {isMe && (
                          <span className="opacity-70">
                            {msg.is_read ? <CheckCheck size={12} className="text-blue-500" /> : <Check size={12} />}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Copy Button */}
                    {msg.content && (
                      <button 
                        onClick={() => handleCopy(msg.content, index)}
                        className="opacity-0 group-hover/msg:opacity-100 transition-opacity p-2 hover:bg-[var(--color-crazy-yellow)] bg-white rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                        title="Copy message"
                      >
                        {copiedId === index ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
        
        {/* Chat Typing Indicator Area */}
        {Object.keys(typingUsers[conversationId] || {}).length > 0 && (
            <div className="flex items-center gap-2 mt-4 ml-4">
                <div className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center">
                    <span className="text-[10px] font-black">??</span>
                </div>
                <div className="bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-br-xl rounded-tr-xl rounded-tl-xl flex gap-1 items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                </div>
            </div>
        )}
      </div>

      {/* INPUT BAR */}
      <div className="border-t-4 border-black p-4 bg-[var(--color-crazy-green)]">

        {/* Pending attachment preview */}
        {pendingAttachment && (
          <div className="mb-3 flex items-center gap-2">
            {pendingAttachment.type === "image" ? (
              <img
                src={pendingAttachment.url}
                alt="preview"
                className="h-16 w-16 object-cover border-2 border-black"
              />
            ) : (
              <div className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2">
                <FileText size={18} />
                <span className="font-bold text-sm truncate max-w-[160px]">
                  {pendingAttachment.name}
                </span>
              </div>
            )}
            <button
              onClick={() => setPendingAttachment(null)}
              className="border-2 border-black p-1 bg-red-400 hover:bg-red-500"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex gap-2 relative">

          {/* Emoji picker */}
          <div className="relative" ref={emojiRef}>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="bg-white border-4 border-black p-3 h-full"
            >
              <Smile size={24} />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-50">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setInputValue((prev) => prev + emojiData.emoji);
                    setShowEmojiPicker(false);
                  }}
                  width={320}
                  height={400}
                />
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Paperclip button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            title="Attach image, video or PDF"
            className={`border-4 border-black p-3 h-full ${
              uploading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {uploading ? (
              <span className="text-xs font-black animate-pulse">...</span>
            ) : (
              <Paperclip size={24} />
            )}
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type something ..."
            className="flex-1 border-4 border-black px-4 py-3 font-bold bg-white"
          />

          <button
            onClick={handleSend}
            disabled={uploading}
            className="bg-black text-white border-4 border-black p-3 disabled:opacity-50"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;