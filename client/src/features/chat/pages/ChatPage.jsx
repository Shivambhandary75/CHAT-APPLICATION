import { useChatInit } from "../hooks/useChatInit";
import ChatLayout from "../components/layout/ChatLayout";

function ChatPage() {
    useChatInit();
    return <ChatLayout />;
}

export default ChatPage;