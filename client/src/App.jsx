import React, { useState, useEffect, useRef } from "react";
import { Send, Menu, X, Paperclip, Phone, Video, MoreVertical, Hash, Bell } from "lucide-react";
import { motion } from "framer-motion";

// --- Dummy Data ---
const CONTACTS = [
  { id: "1", name: "Glitchy Gab", avatarColor: "bg-[var(--color-crazy-pink)]", status: "online" },
  { id: "2", name: "Retro Rex", avatarColor: "bg-[var(--color-crazy-blue)]", status: "offline" },
  { id: "3", name: "Pixel Pete", avatarColor: "bg-[var(--color-crazy-green)]", status: "online" },
  { id: "4", name: "Vapor Val", avatarColor: "bg-[var(--color-crazy-yellow)]", status: "online" },
];

const INITIAL_MESSAGES = [
  { id: "1", text: "WELCOME TO THE CHAOS ZONE!", sender: "them", timestamp: new Date(Date.now() - 100000) },
  { id: "2", text: "This UI is hurting my eyes in the best way possible.", sender: "me", timestamp: new Date(Date.now() - 80000) },
  { id: "3", text: "No emojis allowed! Only PURE TEXT ENERGY!", sender: "them", timestamp: new Date(Date.now() - 60000) },
];

// --- Components ---

const Button = ({ children, onClick, className, variant = "primary", type = "button" }) => {
  const baseStyle = "border-3 border-black font-bold px-4 py-2 transition-transform active:translate-x-[2px] active:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1";
  
  const variants = {
    primary: "bg-[var(--color-crazy-blue)] text-black",
    secondary: "bg-[var(--color-crazy-green)] text-black",
    danger: "bg-[var(--color-crazy-pink)] text-black",
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className || ""}`}>
      {children}
    </button>
  );
};

const Avatar = ({ color, name }) => (
  <div className={`w-10 h-10 ${color} border-3 border-black rounded-full flex items-center justify-center font-bold text-xs overflow-hidden`}>
    {name.substring(0, 2).toUpperCase()}
  </div>
);

export function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "me",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate response
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        text: "That is wild! The UI is popping off the screen.",
        sender: "them",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--color-crazy-yellow)] font-sans text-black p-4 md:p-8 flex items-center justify-center overflow-hidden">
      
      {/* Background Decor */}
      <div className="fixed top-10 left-10 w-32 h-32 bg-[var(--color-crazy-pink)] border-4 border-black rotate-12 -z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"></div>
      <div className="fixed bottom-20 right-20 w-48 h-48 bg-[var(--color-crazy-green)] border-4 border-black -rotate-6 rounded-full -z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"></div>
      <div className="fixed top-1/2 left-1/4 w-16 h-16 bg-[var(--color-crazy-blue)] border-4 border-black rotate-45 -z-10"></div>

      {/* Main Container */}
      <div className="w-full max-w-6xl h-[85vh] flex border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
        
        {/* Sidebar */}
        <div className={`
          absolute inset-y-0 left-0 z-20 w-64 bg-white border-r-4 border-black transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 flex flex-col
        `}>
          <div className="p-4 border-b-4 border-black bg-[var(--color-crazy-pink)] flex justify-between items-center h-20">
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">Chat_Box</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            {CONTACTS.map((contact) => (
              <motion.div
                key={contact.id}
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setActiveContact(contact);
                  setIsSidebarOpen(false);
                }}
                className={`
                  p-3 border-3 border-black cursor-pointer flex items-center gap-3 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  ${activeContact.id === contact.id ? "bg-[var(--color-crazy-blue)]" : "bg-white hover:bg-gray-50"}
                `}
              >
                <Avatar color={contact.avatarColor} name={contact.name} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{contact.name}</p>
                  <p className="text-xs text-gray-600 truncate">
                    {contact.status === "online" ? "Online now!" : "Last seen recently"}
                  </p>
                </div>
                {contact.status === "online" && (
                  <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t-4 border-black bg-gray-100">
             <Button className="w-full text-sm" variant="secondary">Add Friend +</Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white relative">
          {/* Header */}
          <div className="h-20 border-b-4 border-black bg-[var(--color-crazy-green)] p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
                <Menu className="w-5 h-5" />
              </button>
              <Avatar color={activeContact.avatarColor} name={activeContact.name} />
              <div>
                <h2 className="font-black text-lg leading-none">{activeContact.name}</h2>
                <span className="text-xs font-mono bg-black text-white px-1">@{activeContact.name.replace(/\s/g, '').toLowerCase()}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
               <button className="p-2 border-2 border-black bg-white hover:bg-[var(--color-crazy-pink)] transition-colors rounded-full"><Phone size={18}/></button>
               <button className="p-2 border-2 border-black bg-white hover:bg-[var(--color-crazy-blue)] transition-colors rounded-full"><Video size={18}/></button>
               <button className="p-2 border-2 border-black bg-white hover:bg-[var(--color-crazy-yellow)] transition-colors rounded-full"><MoreVertical size={18}/></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-gray-100">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div className={`
                  max-w-[80%] md:max-w-[60%] p-4 border-3 border-black text-sm md:text-base relative
                  ${msg.sender === "me" 
                    ? "bg-[var(--color-crazy-blue)] rounded-l-2xl rounded-tr-2xl shadow-[-6px_6px_0px_0px_rgba(0,0,0,1)] mr-2" 
                    : "bg-[var(--color-crazy-pink)] rounded-r-2xl rounded-tl-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ml-2"
                  }
                `}>
                   {/* Speech Bubble Tail */}
                   <div className={`absolute top-0 w-0 h-0 border-8 border-transparent ${
                     msg.sender === "me" 
                     ? "-right-[19px] border-l-black border-t-black" // Weird tail attempt
                     : "-left-[19px] border-r-black border-t-black"
                   }`}></div>
                   
                   {/* Inner Tail Color Fix - simplistic approach, using SVG might be cleaner but CSS shapes are "crazier" */}
                   
                  <p className="font-bold font-mono mb-1 text-[10px] opacity-60 uppercase">{msg.sender === "me" ? "YOU" : activeContact.name}</p>
                  <p className="leading-snug font-medium">{msg.text}</p>
                  <p className="text-[10px] text-right mt-2 opacity-50 font-mono">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-[var(--color-crazy-pink)] border-3 border-black p-3 rounded-r-2xl rounded-tl-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ml-2 text-sm font-bold animate-pulse">
                  Typing...
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t-4 border-black">
            <form onSubmit={handleSendMessage} className="flex items-end gap-2 md:gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type something wild..."
                  className="w-full border-3 border-black p-4 pr-12 text-lg font-bold bg-gray-50 focus:bg-[var(--color-crazy-yellow)] focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors"
                />
                <div className="absolute right-3 bottom-3 flex gap-1">
                   {/* Fake buttons */}
                </div>
              </div>
              <Button type="submit" className="h-[62px] w-[62px] flex items-center justify-center !p-0 bg-black text-white hover:bg-gray-800" variant="primary">
                 <Send className="w-6 h-6 text-[var(--color-crazy-green)]" />
              </Button>
            </form>
            <div className="flex gap-4 mt-3 pl-2">
                <button className="hover:text-[var(--color-crazy-pink)] transition-colors"><Paperclip size={20}/></button>
                <button className="hover:text-[var(--color-crazy-blue)] transition-colors"><Hash size={20}/></button>
                <button className="hover:text-[var(--color-crazy-green)] transition-colors"><Bell size={20}/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
