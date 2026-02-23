import { useChatStore } from "../../store/ChatStore";

export default function ConversationItem({ conversation }) {
    const setActive = useChatStore(
        (s) => s.setActiveConversation
    );

    return (
        <div
            onClick={() => setActive(conversation.id)}
            style={{
                padding: 16,
                cursor: "pointer",
                borderBottom: "1px solid #eee"
            }}
        >
            {conversation}
        </div>
    );
}