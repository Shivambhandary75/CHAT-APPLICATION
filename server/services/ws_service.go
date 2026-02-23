package services

import (
	"encoding/json"
	"time"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/ws"
)

type WSService struct {
	hub                 *ws.Hub
	messageService      *MessageService
	conversationService *ConversationService
}

func NewWSService(
	hub *ws.Hub,
	messageService *MessageService,
	conversationService *ConversationService,
) *WSService {
	return &WSService{
		hub:                 hub,
		messageService:      messageService,
		conversationService: conversationService,
	}
}

type IncomingMessage struct {
	ConversationID string `json:"conversation_id"`
	Content        string `json:"content"`
}

func (s *WSService) HandleMessage(senderID string, raw []byte) {

	var msg IncomingMessage
	err := json.Unmarshal(raw, &msg)
	if err != nil {
		return
	}

	// Save to DB (with security check)
	err = s.messageService.SendMessage(msg.ConversationID, senderID, msg.Content)
	if err != nil {
		return
	}

	// Get participants
	participants, err := s.conversationService.GetParticipants(msg.ConversationID)
	if err != nil {
		return
	}

	// Broadcast to all participants
	for _, userID := range participants {

		payload := map[string]string{
			"conversation_id": msg.ConversationID,
			"sender_id":       senderID,
			"content":         msg.Content,
			"created_at":      time.Now().UTC().Format(time.RFC3339),
		}

		data, _ := json.Marshal(payload)

		s.hub.SendToUser(userID, data)
	}
}