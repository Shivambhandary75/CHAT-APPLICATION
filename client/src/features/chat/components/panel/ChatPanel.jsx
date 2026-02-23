import { useChatStore } from "../../store/ChatStore";
import { useMessages } from "../../hooks/useMessages";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatPanel() {
    const activeId = useChatStore(
        (s) => s.selectedConversation.ID
    );

    useMessages(activeId);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100%"
            }}
        >
            <MessageList conversationId={activeId} />
            <MessageInput conversationId={activeId} />
        </div>
    );
}