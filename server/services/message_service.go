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

func (s *MessageService) SendMessage(conversationID string, senderID string, content string) error {

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

	return s.repo.FindByConversation(convID)
}