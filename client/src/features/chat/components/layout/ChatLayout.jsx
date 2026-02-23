import { useChatStore } from "../../store/ChatStore";
import Sidebar from "../sidebar/Sidebar";
import MessagePanel from "../panel/ChatPanel";

export default function ChatLayout() {
    const selectedConversation = useChatStore(
        (s) => s.selectedConversation
    );

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />

            {selectedConversation ? (
                <MessagePanel />
            ) : (
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#888"
                    }}
                >
                    Select a conversation
                </div>
            )}
        </div>
    );
}