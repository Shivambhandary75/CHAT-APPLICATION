package services

import (
	"time"
	"fmt"
	"sort"

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

	if user1 == user2 {
		return nil, fmt.Errorf("cannot create conversation with yourself")
	}

	participants := []string{user1, user2}
	sort.Strings(participants)

	// Check if conversation already exists
	existing, err := s.repo.FindDirectConversation(participants)
	if err != nil {
		return nil, err
	}

	if existing != nil {
		return existing, nil
	}

	conversation := models.Conversation{
		Type:         "direct",
		Participants: participants,
		CreatedAt:    time.Now(),
	}

	return s.repo.Create(conversation)
}

func (s *ConversationService) GetUserConversations(userID string) ([]models.Conversation, error) {
	conversations, err := s.repo.FindByUser(userID)
	if err != nil {
		return nil, err
	}
	
	if conversations == nil {
		conversations = []models.Conversation{}
	}
	
	return conversations, nil
}

func (s *ConversationService) GetParticipants(conversationID string) ([]string, error) {
	return s.repo.GetParticipants(conversationID)
}