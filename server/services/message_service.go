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
}

func NewMessageService(
	repo *repositories.MessageRepository,
	conversationRepo *repositories.ConversationRepository,
) *MessageService {
	return &MessageService{
		repo:             repo,
		conversationRepo: conversationRepo,
	}
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

func (s *MessageService) GetMessages(conversationID string, userID string) ([]models.Message, error) {

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

	// If the user has cleared their chat, only return messages after that timestamp
	clearedAt, err := s.conversationRepo.GetUserClearedAt(convID, userID)
	if err != nil {
		return nil, err
	}
	if clearedAt != nil {
		return s.repo.FindByConversationAfter(convID, *clearedAt)
	}

	return s.repo.FindByConversation(convID)
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
