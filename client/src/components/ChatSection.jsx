import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, MoreVertical, Trash2, ArrowLeft, Smile, File, Image as ImageIcon, FileText, Video as VideoIcon, Download } from "lucide-react";

const EMOJIS = ["😀", "😂", "😍", "😎", "🤔", "👍", "👎", "❤️", "🔥", "✨", "🎉", "💯", "😊", "😢", "😡", "🤩", "😜", "🙏", "💪", "👏"];

const ChatSection = ({ activeContact, onBack }) => {
  const [messages, setMessages] = useState([
    { id: "1", type: "text", text: "WELCOME TO YAPPHERE!", sender: "them", timestamp: new Date(Date.now() - 100000) },
    { id: "2", type: "text", text: "This UI is hurting my eyes in the best way possible.", sender: "me", timestamp: new Date(Date.now() - 80000) },
    { id: "3", type: "text", text: "No emojis allowed! Only PURE TEXT ENERGY!", sender: "them", timestamp: new Date(Date.now() - 60000) },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);
  const emojiRef = useRef(null);
  const fileInputRef = useRef(null);

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
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        type: "text",
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

  const handleEmojiSelect = (emoji) => {
    setInputValue(inputValue + emoji);
    setShowEmojiPicker(false);
  };

  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      // Check file type
      if (file.type.startsWith('image/')) {
        // Images
        reader.onloadend = () => {
          const newMessage = {
            id: Date.now().toString(),
            type: "image",
            fileData: reader.result,
            fileName: file.name,
            fileSize: file.size,
            sender: "me",
            timestamp: new Date(),
          };
          setMessages([...messages, newMessage]);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        // Videos
        reader.onloadend = () => {
          const newMessage = {
            id: Date.now().toString(),
            type: "video",
            fileData: reader.result,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            sender: "me",
            timestamp: new Date(),
          };
          setMessages([...messages, newMessage]);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        // PDFs
        reader.onloadend = () => {
          const newMessage = {
            id: Date.now().toString(),
            type: "pdf",
            fileData: reader.result,
            fileName: file.name,
            fileSize: file.size,
            sender: "me",
            timestamp: new Date(),
          };
          setMessages([...messages, newMessage]);
        };
        reader.readAsDataURL(file);
      } else {
        // Other documents (Word, Excel, text, etc.)
        reader.onloadend = () => {
          const newMessage = {
            id: Date.now().toString(),
            type: "document",
            fileData: reader.result,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            sender: "me",
            timestamp: new Date(),
          };
          setMessages([...messages, newMessage]);
        };
        reader.readAsDataURL(file);
      }
      
      e.target.value = ""; // Reset file input
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
          {onBack && (
            <button
              onClick={onBack}
              className="bg-white border-3 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
            >
              <ArrowLeft size={20} />
            </button>
          )}
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
                    : "bg-white"
                } border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
              >
                {/* Text Message */}
                {msg.type === "text" && (
                  <p className="font-bold text-base break-words">{msg.text}</p>
                )}
                
                {/* Image Message */}
                {msg.type === "image" && (
                  <div>
                    <img 
                      src={msg.fileData} 
                      alt={msg.fileName}
                      className="max-w-full border-2 border-black mb-2"
                      style={{ maxHeight: "300px" }}
                    />
                    <p className="font-bold text-xs opacity-70">{msg.fileName}</p>
                  </div>
                )}
                
                {/* Video Message */}
                {msg.type === "video" && (
                  <div>
                    <video 
                      src={msg.fileData}
                      controls
                      className="max-w-full border-2 border-black mb-2"
                      style={{ maxHeight: "300px" }}
                    />
                    <p className="font-bold text-xs opacity-70">{msg.fileName}</p>
                  </div>
                )}
                
                {/* PDF Message */}
                {msg.type === "pdf" && (
                  <div>
                    <div className="bg-[var(--color-crazy-yellow)] border-2 border-black p-4 mb-2">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText size={32} className="font-black" />
                        <div className="flex-1">
                          <p className="font-bold text-sm">{msg.fileName}</p>
                          <p className="font-bold text-xs opacity-70">
                            {(msg.fileSize / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <a 
                        href={msg.fileData}
                        download={msg.fileName}
                        className="bg-black text-white border-2 border-black px-4 py-2 font-bold uppercase text-sm inline-flex items-center gap-2 hover:bg-[var(--color-crazy-pink)] hover:text-black transition-all"
                      >
                        <Download size={16} />
                        DOWNLOAD PDF
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Document Message */}
                {msg.type === "document" && (
                  <div className="flex items-center gap-3">
                    <div className="bg-white border-2 border-black p-2">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{msg.fileName}</p>
                      <p className="font-bold text-xs opacity-70">
                        {(msg.fileSize / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <a 
                      href={msg.fileData}
                      download={msg.fileName}
                      className="bg-black text-white border-2 border-black p-2 hover:bg-[var(--color-crazy-green)] transition-all"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                )}
                
                <div className="flex items-center justify-end gap-2 mt-2">
                  <span className="text-xs font-bold opacity-70">{formatTime(msg.timestamp)}</span>
                  {msg.sender === "me" && (
                    <span className="text-xs font-black">✓✓</span>
                  )}
                </div>
              </div>
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
            placeholder="Type something ..."
            className="flex-1 border-4 border-black px-4 py-3 font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
            style={{ fontFamily: "var(--font-display)" }}
          />
          <button
            onClick={handleSend}
            className="bg-black text-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Send size={24} />
          </button>
        </div>
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        />

        <div className="flex gap-3 mt-3 relative">
          <button 
            onClick={handleAttachment}
            className="bg-white border-3 border-black p-2 px-3 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
          >
            <Paperclip size={18} className="inline mr-1" />
          </button>
          <div className="relative" ref={emojiRef}>
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="bg-white border-3 border-black p-2 px-3 font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px]"
            >
              <Smile size={18} className="inline" />
            </button>
            
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 z-10 w-64">
                <div className="grid grid-cols-5 gap-2">
                  {EMOJIS.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiSelect(emoji)}
                      className="text-2xl hover:bg-[var(--color-crazy-yellow)] border-2 border-black p-2 transition-all hover:scale-110 active:scale-95"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
