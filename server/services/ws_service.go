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

	// Save to DB (with security check)
	err = s.messageService.SendMessage(msg.ConversationID, senderID, msg.Content, msg.AttachmentURL, msg.AttachmentType)
	if err != nil {
		return
	}

	// Get participants
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

		payload := map[string]interface{}{
			"conversation_id": msg.ConversationID,
			"sender_id":       senderID,
			"content":         msg.Content,
			"attachment_url":  msg.AttachmentURL,
			"attachment_type": msg.AttachmentType,
			"created_at":      time.Now().UTC().Format(time.RFC3339),
			"sender":          senderInfo,
		}

		data, _ := json.Marshal(payload)

		s.hub.SendToUser(userID, data)
	}
}
