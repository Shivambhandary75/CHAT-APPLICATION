import { useChatInit } from "../hooks/useChatInit";
import ChatLayout from "../components/ChatLayout";

function ChatPage() {
    useChatInit();
    return <ChatLayout />;
}

export default ChatPage;