package services

import (
	"encoding/json"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/ws"
)

type WSService struct {
	hub              *ws.Hub
	messageService   *MessageService
	conversationService *ConversationService
}

func NewWSService(
	hub *ws.Hub,
	messageService *MessageService,
	conversationService *ConversationService,
) *WSService {
	return &WSService{
		hub: hub,
		messageService: messageService,
		conversationService: conversationService,
	}
}

type IncomingMessage struct {
	ConversationID string `json:"conversation_id"`
	Content        string `json:"content"`
}

func (s *WSService) HandleMessage(senderID string, data []byte) error {

	var msg IncomingMessage
	if err := json.Unmarshal(data, &msg); err != nil {
		return err
	}

	// Save message securely
	err := s.messageService.SendMessage(msg.ConversationID, senderID, msg.Content)
	if err != nil {
		return err
	}

	// Get participants
	participants, err := s.conversationService.GetParticipants(msg.ConversationID)
	if err != nil {
		return err
	}

	// Broadcast
	for _, userID := range participants {
		s.hub.SendToUser(userID, data)
	}

	return nil
}