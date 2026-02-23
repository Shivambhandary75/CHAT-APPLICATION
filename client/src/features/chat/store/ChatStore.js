import { create } from "zustand";

export const useChatStore = create((set) => ({
    conversations: [],
    selectedConversation: null,
    messages: {},

    setConversations: (convs) =>
        set({
            conversations: Array.isArray(convs) ? convs : []
        }),

    setSelectedConversation: (conversation) =>
        set({
            selectedConversation: conversation
        }),

    setMessages: (conversationId, messages) =>
        set((state) => ({
            messages: {
                ...state.messages,
                [conversationId]: messages
            }
        })),

    addMessage: (conversationId, message) =>
        set((state) => ({
            messages: {
                ...state.messages,
                [conversationId]: [
                    ...(state.messages[conversationId] || []),
                    message
                ]
            }
        }))
}));