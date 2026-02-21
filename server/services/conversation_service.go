package services

import (
	"time"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/repositories"
)

type ConversationService struct {
	repo *repositories.ConversationRepository
}

func NewConversationService(repo *repositories.ConversationRepository) *ConversationService {
	return &ConversationService{repo: repo}
}

func (s *ConversationService) CreateDirectConversation(user1, user2 string) (*models.Conversation, error) {

	conversation := models.Conversation{
		Type:         "direct",
		Participants: []string{user1, user2},
		CreatedAt:    time.Now(),
	}

	return s.repo.Create(conversation)
}

func (s *ConversationService) GetUserConversations(userID string) ([]models.Conversation, error) {
	return s.repo.FindByUser(userID)
}