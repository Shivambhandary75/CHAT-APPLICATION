import { useEffect } from "react";
import { useChatStore } from "../store/ChatStore";
import chatService from "../services/ChatService";
import { socketClient } from "../../../core/socket/socketClient";

export const useChatInit = () => {
    const setConversations = useChatStore(
        (s) => s.setConversations
    );

    const addMessage = useChatStore(
        (s) => s.addMessage
    );

    useEffect(() => {
        const currentUserId = localStorage.getItem("user_id");

        const init = async () => {
            try {
                const conversations =
                    await chatService.fetchConversations();

                setConversations(conversations);

                const token = localStorage.getItem("authToken");

                if (token) {
                    socketClient.connect(token);
                } else {
                    console.warn("No auth token found");
                }

            } catch (err) {
                console.error("Chat init failed:", err);
            }
        };

        // Handler for incoming WebSocket messages
        const handler = (data) => {
            // Skip messages sent by the current user (already rendered optimistically)
            if (data.sender_id === currentUserId) return;
            addMessage(data.conversation_id, data);
        };

        socketClient.on("message", handler);

        init();

        return () => {
            socketClient.off("message", handler);
            socketClient.disconnect();
        };
    }, []);
};