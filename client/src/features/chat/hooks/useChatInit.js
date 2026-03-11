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
            const selectedConv = useChatStore.getState().selectedConversation;
            const isSelected = selectedConv && (selectedConv.id === data.conversation_id || selectedConv._id === data.conversation_id || selectedConv.ID === data.conversation_id);

            switch (data.type) {
                case "online_status":
                    useChatStore.getState().setOnlineUser(data.user_id, data.is_online);
                    break;
                case "typing":
                    if (data.sender_id !== currentUserId) {
                        useChatStore.getState().setTypingUser(data.conversation_id, data.sender_id, true);
                        // Auto clear typing after 3 seconds
                        setTimeout(() => {
                           useChatStore.getState().setTypingUser(data.conversation_id, data.sender_id, false);
                        }, 3000);
                    }
                    break;
                case "read":
                    if (isSelected) {
                        useChatStore.getState().markMessageRead(data.conversation_id, null);
                    }
                    break;
                case "chat_message":
                default:
                    if (data.sender_id !== currentUserId) {
                        useChatStore.getState().addMessage(data.conversation_id, data);
                        useChatStore.getState().updateConversationLastMessage(data.conversation_id, data, !isSelected);
                        
                        // If it is selected, send a read receipt back!
                        if (isSelected) {
                            socketClient.send({
                                type: "read",
                                conversation_id: data.conversation_id
                            });
                        }
                    } else {
                        // We generated it optimistically maybe, but let's update conversation list anyway
                        useChatStore.getState().updateConversationLastMessage(data.conversation_id, data, false);
                    }
                    break;
            }
        };

        socketClient.on("message", handler);

        init();

        return () => {
            socketClient.off("message", handler);
            socketClient.disconnect();
        };
    }, []);
};