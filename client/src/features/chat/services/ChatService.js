import http from "../../../core/api/httpClient";

const normalizeConversation = (c) => ({
    id: c._id,
    ...c,
});

const chatService = {

    async fetchConversations() {
        const res = await http.get("/conversations");

        const data = Array.isArray(res.data) ? res.data : [];

        return data.map(normalizeConversation);
    },


    async fetchMessages(conversationId) {
        const res = await http.get(
            `/conversations/${conversationId}/messages`
        );

        return Array.isArray(res.data) ? res.data : [];
    },

    async createOrGetDirectConversation(friendId) {
        const res = await http.post("/conversations", {
            recipient_id: friendId,
        });

        const data = res.data;

        const conversation = data.conversation || data;

        return {
            id: conversation.ID || conversation.id || conversation._id,
            ...conversation,
        };
    },

    async getOrCreateGroupConversation(groupId) {
        const res = await http.get(`/groups/${groupId}/conversation`);
        const conversation = res.data;

        return {
            id: conversation.id || conversation.ID || conversation._id,
            ...conversation,
        };
    },
};

export default chatService;