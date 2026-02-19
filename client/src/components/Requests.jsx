import React, { useState } from "react";
import { UserCheck, UserX, X, Send, Inbox } from "lucide-react";
import CustomAlert from "./CustomAlert";

const SENT_REQUESTS = [
  { id: "1", name: "Cyber Sam", username: "cybersam", avatarColor: "bg-[var(--color-crazy-blue)]", status: "pending", sentDate: "2 days ago" },
  { id: "2", name: "Techno Tina", username: "technotina", avatarColor: "bg-[var(--color-crazy-pink)]", status: "pending", sentDate: "5 days ago" },
  { id: "3", name: "Wave Walker", username: "wavewalker", avatarColor: "bg-[var(--color-crazy-green)]", status: "pending", sentDate: "1 week ago" },
];

const RECEIVED_REQUESTS = [
  { id: "4", name: "Sonic Steve", username: "sonicsteve", avatarColor: "bg-[var(--color-crazy-yellow)]", receivedDate: "1 hour ago" },
  { id: "5", name: "Pixel Patty", username: "pixelpatty", avatarColor: "bg-[var(--color-crazy-pink)]", receivedDate: "3 hours ago" },
  { id: "6", name: "Digital Dave", username: "digitaldave", avatarColor: "bg-[var(--color-crazy-blue)]", receivedDate: "Yesterday" },
];

const Requests = () => {
  const [activeTab, setActiveTab] = useState("received"); // "sent" or "received"
  const [sentRequests, setSentRequests] = useState(SENT_REQUESTS);
  const [receivedRequests, setReceivedRequests] = useState(RECEIVED_REQUESTS);
  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: "",
    type: "alert",
    onConfirm: null,
  });

  const handleCancelRequest = (requestId) => {
    setAlertState({
      isOpen: true,
      message: "CANCEL THIS FRIEND REQUEST?",
      type: "confirm",
      onConfirm: () => {
        setSentRequests(sentRequests.filter(r => r.id !== requestId));
        setAlertState({
          isOpen: true,
          message: "FRIEND REQUEST CANCELLED!",
          type: "alert",
          onConfirm: null,
        });
      },
    });
  };

  const handleAcceptRequest = (request) => {
    setAlertState({
      isOpen: true,
      message: `ACCEPT FRIEND REQUEST FROM @${request.username.toUpperCase()}?`,
      type: "confirm",
      onConfirm: () => {
        setReceivedRequests(receivedRequests.filter(r => r.id !== request.id));
        setAlertState({
          isOpen: true,
          message: `YOU ARE NOW FRIENDS WITH @${request.username.toUpperCase()}!`,
          type: "alert",
          onConfirm: null,
        });
      },
    });
  };

  const handleRejectRequest = (request) => {
    setAlertState({
      isOpen: true,
      message: `REJECT FRIEND REQUEST FROM @${request.username.toUpperCase()}?`,
      type: "confirm",
      onConfirm: () => {
        setReceivedRequests(receivedRequests.filter(r => r.id !== request.id));
        setAlertState({
          isOpen: true,
          message: "FRIEND REQUEST REJECTED!",
          type: "alert",
          onConfirm: null,
        });
      },
    });
  };

  return (
    <div className="h-full bg-[var(--color-crazy-blue)] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--color-crazy-yellow)] border-b-4 border-black p-4">
        <h2 className="font-black text-2xl uppercase text-center">FRIEND REQUESTS</h2>
      </div>

      {/* Tabs */}
      <div className="border-b-4 border-black bg-white flex">
        <button
          onClick={() => setActiveTab("received")}
          className={`flex-1 ${
            activeTab === "received" ? "bg-[var(--color-crazy-pink)]" : "bg-white"
          } border-r-4 border-black p-4 font-black uppercase flex items-center justify-center gap-2 hover:bg-[var(--color-crazy-pink)] transition-all`}
        >
          <Inbox size={20} />
          RECEIVED ({receivedRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`flex-1 ${
            activeTab === "sent" ? "bg-[var(--color-crazy-green)]" : "bg-white"
          } p-4 font-black uppercase flex items-center justify-center gap-2 hover:bg-[var(--color-crazy-green)] transition-all`}
        >
          <Send size={20} />
          SENT ({sentRequests.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "received" && (
          <div className="space-y-4">
            {receivedRequests.length === 0 ? (
              <div className="bg-white border-6 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-12 text-center">
                <Inbox size={60} className="mx-auto mb-4 opacity-30" />
                <p className="font-black text-xl uppercase">NO PENDING REQUESTS</p>
                <p className="font-bold text-sm mt-2">YOU'RE ALL CAUGHT UP!</p>
              </div>
            ) : (
              receivedRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* User Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-16 h-16 ${request.avatarColor} border-4 border-black rounded-full flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                        {request.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-xl">{request.name}</p>
                        <p className="font-bold text-sm">@{request.username}</p>
                        <p className="font-bold text-xs opacity-60 mt-1">{request.receivedDate}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAcceptRequest(request)}
                        className="bg-[var(--color-crazy-green)] border-4 border-black font-black px-6 py-3 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-2"
                      >
                        <UserCheck size={18} />
                        ACCEPT
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request)}
                        className="bg-[var(--color-crazy-pink)] border-4 border-black font-black px-6 py-3 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-2"
                      >
                        <UserX size={18} />
                        REJECT
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "sent" && (
          <div className="space-y-4">
            {sentRequests.length === 0 ? (
              <div className="bg-white border-6 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-12 text-center">
                <Send size={60} className="mx-auto mb-4 opacity-30" />
                <p className="font-black text-xl uppercase">NO SENT REQUESTS</p>
                <p className="font-bold text-sm mt-2">ADD FRIENDS TO SEND REQUESTS!</p>
              </div>
            ) : (
              sentRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white border-6 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* User Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-16 h-16 ${request.avatarColor} border-4 border-black rounded-full flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                        {request.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-xl">{request.name}</p>
                        <p className="font-bold text-sm">@{request.username}</p>
                        <p className="font-bold text-xs opacity-60 mt-1">Sent {request.sentDate}</p>
                      </div>
                    </div>

                    {/* Status and Cancel */}
                    <div className="flex items-center gap-4">
                      <div className="bg-[var(--color-crazy-yellow)] border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <p className="font-black uppercase text-sm">
                          {request.status === "pending" && " PENDING"}
                          {request.status === "accepted" && "✓ ACCEPTED"}
                          {request.status === "rejected" && "✗ REJECTED"}
                        </p>
                      </div>
                      {request.status === "pending" && (
                        <button
                          onClick={() => handleCancelRequest(request.id)}
                          className="bg-[var(--color-crazy-pink)] border-4 border-black font-black px-6 py-3 uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center gap-2"
                        >
                          <X size={18} />
                          CANCEL
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t-4 border-black p-4">
        <p className="font-bold text-center uppercase text-sm">
          {activeTab === "received" 
            ? `SHOWING: ${receivedRequests.length} RECEIVED REQUEST${receivedRequests.length !== 1 ? 'S' : ''}`
            : `SHOWING: ${sentRequests.length} SENT REQUEST${sentRequests.length !== 1 ? 'S' : ''}`
          }
        </p>
      </div>

      {/* Custom Alert */}
      <CustomAlert
        isOpen={alertState.isOpen}
        onClose={() => setAlertState({ isOpen: false, message: "", type: "alert", onConfirm: null })}
        message={alertState.message}
        type={alertState.type}
        onConfirm={alertState.onConfirm}
      />
    </div>
  );
};

export default Requests;
