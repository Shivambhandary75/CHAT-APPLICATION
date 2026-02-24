"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Smile, Paperclip, X, FileText } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

import { useChatStore } from "../store/ChatStore";
import { socketClient } from "../../../core/socket/socketClient";
import http from "../../../core/api/httpClient";

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

  const conversationMessages = messages[conversationId] || [];

  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState(null); // { url, type, name }
  const [uploading, setUploading] = useState(false);
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

          <div className="w-12 h-12 bg-[var(--color-crazy-blue)] border-4 border-black rounded-full flex items-center justify-center font-black text-sm">
            {(selectedConversation.name ||
              selectedConversation.display_name ||
              selectedConversation.username ||
              "??"
            )
              .substring(0, 2)
              .toUpperCase()}
          </div>

          <div>
            <h2 className="font-black text-xl uppercase">
              {selectedConversation.name ||
                selectedConversation.display_name ||
                selectedConversation.username}
            </h2>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationMessages.map((msg, index) => {
          const isMe = msg.sender_id === currentUserId;

          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[70%]">
                <div
                  className={`${
                    isMe ? "bg-[var(--color-crazy-blue)]" : "bg-white"
                  } border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                >
                  {msg.content && (
                    <p className="font-bold break-words">{msg.content}</p>
                  )}

                  {renderAttachment(msg)}

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
            onChange={(e) => setInputValue(e.target.value)}
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