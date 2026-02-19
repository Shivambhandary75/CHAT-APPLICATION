import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, MoreVertical, Trash2 } from "lucide-react";

const ChatSection = ({ activeContact }) => {
  const [messages, setMessages] = useState([
    { id: "1", text: "WELCOME TO YAPPHERE!", sender: "them", timestamp: new Date(Date.now() - 100000) },
    { id: "2", text: "This UI is hurting my eyes in the best way possible.", sender: "me", timestamp: new Date(Date.now() - 80000) },
    { id: "3", text: "No emojis allowed! Only PURE TEXT ENERGY!", sender: "them", timestamp: new Date(Date.now() - 60000) },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputValue,
        sender: "me",
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setShowMenu(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-crazy-green)]">
      {/* Chat Header */}
      <div className="bg-[var(--color-crazy-green)] border-b-4 border-black p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${activeContact?.avatarColor || "bg-[var(--color-crazy-blue)]"} border-4 border-black rounded-full flex items-center justify-center font-black text-sm`}>
            {activeContact?.name ? activeContact.name.substring(0, 2).toUpperCase() : "GL"}
          </div>
          <div>
            <h2 className="font-black text-xl uppercase">{activeContact?.name || "Glitchy Gab"}</h2>
            <p className="font-bold text-sm">@{activeContact?.username || "glitchygab"}</p>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="bg-white border-3 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
          >
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 bg-[var(--color-crazy-yellow)] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-10 min-w-[180px]">
              <button
                onClick={handleClearChat}
                className="w-full px-4 py-3 font-black uppercase text-left hover:bg-[var(--color-crazy-pink)] border-b-2 border-black flex items-center gap-2"
              >
                <Trash2 size={16} />
                CLEAR CHAT
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[70%]">
              <div
                className={`${
                  msg.sender === "me"
                    ? "bg-[var(--color-crazy-blue)]"
                    : "bg-[var(--color-crazy-pink)]"
                } border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
              >
                <div className="mb-1">
                  <span className="font-bold text-xs uppercase">
                    {msg.sender === "me" ? "YOU" : activeContact?.name?.toUpperCase() || "GLITCHY GAB"}
                  </span>
                </div>
                <p className="font-bold text-base break-words">{msg.text}</p>
              </div>
              <p className="text-xs font-bold mt-1 px-1">{formatTime(msg.timestamp)}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t-4 border-black p-4 bg-[var(--color-crazy-green)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type something wild..."
            className="flex-1 border-4 border-black px-4 py-3 font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
            style={{ fontFamily: "var(--font-display)" }}
          />
          <button className="bg-black text-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]">
            <Paperclip size={24} />
          </button>
          <button
            onClick={handleSend}
            className="bg-black text-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Send size={24} />
          </button>
        </div>
        <div className="flex gap-3 mt-3">
          <button className="bg-white border-3 border-black p-2 px-3 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]">
              <Paperclip size={18} className="inline mr-1" />
            </button>
          <button className="bg-white border-3 border-black p-2 px-3 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]">
              #
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
