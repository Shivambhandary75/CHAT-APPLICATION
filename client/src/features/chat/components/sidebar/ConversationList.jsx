"use client";

import { useChatStore } from "../../store/ChatStore";
import chatService from "../../services/ChatService";

export default function ConversationList() {
  const conversations = useChatStore((s) => s.conversations);
  const setSelectedConversation = useChatStore(
    (s) => s.setSelectedConversation
  );
  const setMessages = useChatStore((s) => s.setMessages);

  const handleSelect = async (conversation) => {
    setSelectedConversation(conversation);

    try {
      const messages = await chatService.fetchMessages(
        conversation._id || conversation.ID
      );

      setMessages(conversation._id || conversation.ID, messages);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  return (
    <div>
      {conversations.map((conv, idx) => (
        <div
          key={idx}
          onClick={() => handleSelect(conv)}
          style={{ padding: 10, cursor: "pointer" }}
        >
          {conv.display_name || conv.ID}
        </div>
      ))}
    </div>
  );
}