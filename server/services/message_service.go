package services

import (
	"fmt"
	"time"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/repositories"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type MessageService struct {
	repo             *repositories.MessageRepository
	conversationRepo *repositories.ConversationRepository
	authRepo         *repositories.AuthRepository
}

func NewMessageService(
	repo *repositories.MessageRepository,
	conversationRepo *repositories.ConversationRepository,
	authRepo *repositories.AuthRepository,
) *MessageService {
	return &MessageService{
		repo:             repo,
		conversationRepo: conversationRepo,
		authRepo:         authRepo,
	}
}

type SenderInfo struct {
	ID          string `json:"id"`
	Username    string `json:"username"`
	DisplayName string `json:"display_name"`
	PhotoURL    string `json:"photo_url"`
}

type MessageEnriched struct {
	models.Message
	Sender *SenderInfo `json:"sender,omitempty"`
}

func (s *MessageService) SendMessage(conversationID string, senderID string, content string, attachmentURL string, attachmentType string) error {

	// Convert conversationID
	convID, err := bson.ObjectIDFromHex(conversationID)
	if err != nil {
		return err
	}

	// SECURITY CHECK
	allowed, err := s.conversationRepo.IsParticipant(convID, senderID)
	if err != nil {
		return err
	}
	if !allowed {
		return fmt.Errorf("unauthorized")
	}

	message := models.Message{
		ConversationID: convID,
		SenderID:       senderID,
		Content:        content,
		AttachmentURL:  attachmentURL,
		AttachmentType: attachmentType,
		CreatedAt:      time.Now(),
	}

	return s.repo.Create(message)
}

func (s *MessageService) GetMessages(conversationID string, userID string) ([]MessageEnriched, error) {

	convID, err := bson.ObjectIDFromHex(conversationID)
	if err != nil {
		return nil, err
	}

	// SECURITY CHECK
	allowed, err := s.conversationRepo.IsParticipant(convID, userID)
	if err != nil {
		return nil, err
	}
	if !allowed {
		return nil, fmt.Errorf("unauthorized")
	}

	var rawMsgs []models.Message
	// If the user has cleared their chat, only return messages after that timestamp
	clearedAt, err := s.conversationRepo.GetUserClearedAt(convID, userID)
	if err != nil {
		return nil, err
	}
	if clearedAt != nil {
		rawMsgs, err = s.repo.FindByConversationAfter(convID, *clearedAt)
	} else {
		rawMsgs, err = s.repo.FindByConversation(convID)
	}

	if err != nil {
		return nil, err
	}

	// Enrich messages
	enriched := make([]MessageEnriched, 0, len(rawMsgs))
	// caching user lookups for efficiency
	userCache := make(map[string]*SenderInfo)

	for _, m := range rawMsgs {
		e := MessageEnriched{Message: m}
		if sinfo, ok := userCache[m.SenderID]; ok {
			e.Sender = sinfo
		} else {
			u, _ := s.authRepo.FindByID(m.SenderID)
			if u != nil {
				sinfo := &SenderInfo{
					ID:          u.ID.Hex(),
					Username:    u.Username,
					DisplayName: u.DisplayName,
					PhotoURL:    u.PhotoURL,
				}
				userCache[m.SenderID] = sinfo
				e.Sender = sinfo
			}
		}
		enriched = append(enriched, e)
	}

	return enriched, nil
}

func (s *MessageService) GetLatestMessage(conversationID string) (*models.Message, error) {
	convID, err := bson.ObjectIDFromHex(conversationID)
	if err != nil {
		return nil, err
	}
	return s.repo.FindLatestByConversation(convID)
}

func (s *MessageService) ClearMessages(conversationID string, userID string) error {
	convID, err := bson.ObjectIDFromHex(conversationID)
	if err != nil {
		return err
	}

	// SECURITY CHECK – only participants can clear
	allowed, err := s.conversationRepo.IsParticipant(convID, userID)
	if err != nil {
		return err
	}
	if !allowed {
		return fmt.Errorf("unauthorized")
	}

	// Record the current time as the user's clear point.
	// Messages up to (and including) this moment become invisible for this user only.
	// The other participant's view is completely unaffected.
	return s.conversationRepo.SetUserClearedAt(convID, userID, time.Now())
}
