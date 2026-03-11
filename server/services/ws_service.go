package services

import (
	"encoding/json"
	"time"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/repositories"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/ws"
)

type WSService struct {
	hub                 *ws.Hub
	messageService      *MessageService
	conversationService *ConversationService
	authRepo            *repositories.AuthRepository
}

func NewWSService(
	hub *ws.Hub,
	messageService *MessageService,
	conversationService *ConversationService,
	authRepo *repositories.AuthRepository,
) *WSService {
	return &WSService{
		hub:                 hub,
		messageService:      messageService,
		conversationService: conversationService,
		authRepo:            authRepo,
	}
}

type IncomingMessage struct {
	Type           string `json:"type"` // "chat_message", "typing", "read"
	ConversationID string `json:"conversation_id"`
	Content        string `json:"content"`
	AttachmentURL  string `json:"attachment_url"`
	AttachmentType string `json:"attachment_type"`
}

func (s *WSService) HandleMessage(senderID string, raw []byte) {

	var msg IncomingMessage
	err := json.Unmarshal(raw, &msg)
	if err != nil {
		return
	}

	if msg.Type == "" {
		msg.Type = "chat_message" // Default for backward compatibility
	}

	// For standard chat messages, we save them to the DB
	if msg.Type == "chat_message" {
		// Save to DB (with security check)
		err = s.messageService.SendMessage(msg.ConversationID, senderID, msg.Content, msg.AttachmentURL, msg.AttachmentType)
		if err != nil {
			return
		}
	}

	// Get participants (required for broadcasting to the right people)
	participants, err := s.conversationService.GetParticipants(msg.ConversationID)
	if err != nil {
		return
	}

	// Fetch sender details
	var senderInfo *SenderInfo
	senderUser, err := s.authRepo.FindByID(senderID)
	if err == nil && senderUser != nil {
		senderInfo = &SenderInfo{
			ID:          senderUser.ID.Hex(),
			Username:    senderUser.Username,
			DisplayName: senderUser.DisplayName,
			PhotoURL:    senderUser.PhotoURL,
		}
	}

	// Broadcast to all participants
	for _, userID := range participants {

		// Build payload dynamically based on Type
		payload := map[string]interface{}{
			"type":            msg.Type,
			"conversation_id": msg.ConversationID,
			"sender_id":       senderID,
		}

		if msg.Type == "chat_message" {
			payload["content"] = msg.Content
			payload["attachment_url"] = msg.AttachmentURL
			payload["attachment_type"] = msg.AttachmentType
			payload["created_at"] = time.Now().UTC().Format(time.RFC3339)
			payload["sender"] = senderInfo
		}

		data, _ := json.Marshal(payload)

		s.hub.SendToUser(userID, data)
	}
}
