import { create } from "zustand";

export const useChatStore = create((set) => ({
  conversations: [],
  selectedConversation: null,
  messages: {},
  onlineUsers: {}, // { userId: boolean }
  typingUsers: {}, // { conversationId: { userId: boolean } }

  setOnlineUser: (userId, isOnline) =>
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, [userId]: isOnline },
    })),

  setTypingUser: (conversationId, userId, isTyping) =>
    set((state) => {
      const convTypers = state.typingUsers[conversationId] || {};
      if (isTyping) {
        return {
          typingUsers: {
            ...state.typingUsers,
            [conversationId]: { ...convTypers, [userId]: true },
          },
        };
      } else {
        const newConvTypers = { ...convTypers };
        delete newConvTypers[userId];
        return {
          typingUsers: {
            ...state.typingUsers,
            [conversationId]: newConvTypers,
          },
        };
      }
    }),

  updateConversationLastMessage: (conversationId, message, incrementUnread) =>
    set((state) => {
      const convs = [...state.conversations];
      const idx = convs.findIndex((c) => (c.id || c._id || c.ID) === conversationId);
      if (idx !== -1) {
        const c = { ...convs[idx] };
        c.last_message = message;
        if (incrementUnread) {
          c.unread_count = (c.unread_count || 0) + 1;
        }
        convs.splice(idx, 1);
        convs.unshift(c); // Move to top
      }
      return { conversations: convs };
    }),

  markConversationRead: (conversationId) =>
    set((state) => {
      const convs = state.conversations.map((c) => {
        if ((c.id || c._id || c.ID) === conversationId) {
          return { ...c, unread_count: 0 };
        }
        return c;
      });
      return { conversations: convs };
    }),

  setConversations: (convs) =>
    set({
      conversations: Array.isArray(convs) ? convs : [],
    }),

  setSelectedConversation: (conversation) =>
    set({
      selectedConversation: conversation,
    }),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    })),

  addMessage: (conversationId, message) =>
    set((state) => {
      const msgs = state.messages[conversationId] || [];
      // avoid duplicates by ID or _id
      const exists = msgs.some(m => (m.id && m.id === message.id) || (m._id && m._id === message._id));
      if (exists && (message.id || message._id)) return state;
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...msgs, message],
        },
      };
    }),

  markMessageRead: (conversationId, messageId) =>
    set((state) => {
      const msgs = state.messages[conversationId] || [];
      const updatedMsgs = msgs.map(m => {
        if (!messageId || m.id === messageId || m._id === messageId) {
          return { ...m, is_read: true };
        }
        return m;
      });
      return {
        messages: {
          ...state.messages,
          [conversationId]: updatedMsgs,
        },
      };
    }),

  clearMessages: (conversationId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [],
      },
    })),
}));
