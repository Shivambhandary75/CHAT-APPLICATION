import { useEffect } from "react";
import { useChatStore } from "../store/ChatStore";
import chatService from "../services/ChatService";

export const useMessages = (conversationId) => {
    const setMessages = useChatStore((s) => s.setMessages);

    useEffect(() => {
        if (!conversationId) return;

        const load = async () => {
            const messages =
                await chatService.fetchMessages(conversationId);

            setMessages(conversationId, messages);
        };

        load();
    }, [conversationId]);
};