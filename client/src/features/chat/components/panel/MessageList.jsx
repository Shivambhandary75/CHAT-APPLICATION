import { useChatStore } from "../../store/ChatStore";

export default function MessageList() {
  const selectedConversation = useChatStore(
    (s) => s.selectedConversation
  );

  const messages = useChatStore((s) => s.messages);

  if (!selectedConversation) return null;

  const conversationId =
    selectedConversation._id || selectedConversation.ID;

  const conversationMessages =
    messages[conversationId] || [];

  return (
    <div style={{ padding: 16 }}>
      {conversationMessages.length === 0 ? (
        <div>No messages yet</div>
      ) : (
        conversationMessages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <strong>{msg.sender_username || msg.sender_id}</strong>: {msg.content}
          </div>
        ))
      )}
    </div>
  );
}