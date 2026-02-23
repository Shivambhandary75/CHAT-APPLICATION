import http from "../../../core/api/httpClient";

export const messageService = {
    async fetchMessages(conversationId) {
        const res = await http.get(
            `/conversations/${conversationId}/messages`
        );
        return res.data;
    }
};