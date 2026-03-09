package services

import (
	"fmt"
	"sort"
	"time"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/repositories"
	"go.mongodb.org/mongo-driver/v2/bson"
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

func (s *ConversationService) CreateGroupConversation(groupID string, name string, members []string) (*models.Conversation, error) {
	existing, err := s.repo.FindByGroupID(groupID)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		// Always sync participants so newly-added members can access the chat.
		if syncErr := s.repo.UpdateParticipants(existing.ID, members); syncErr == nil {
			existing.Participants = members
		}
		return existing, nil
	}

	conversation := models.Conversation{
		Type:         "group",
		Name:         name,
		GroupID:      groupID,
		Participants: members,
		CreatedAt:    time.Now(),
	}

	return s.repo.Create(conversation)
}

func (s *ConversationService) GetOrCreateGroupConversation(groupID string, name string, members []string) (*models.Conversation, error) {
	return s.CreateGroupConversation(groupID, name, members)
}

func (s *ConversationService) UpdateConversationParticipants(conversationID string, participants []string) error {
	objID, err := bson.ObjectIDFromHex(conversationID)
	if err != nil {
		return err
	}
	return s.repo.UpdateParticipants(objID, participants)
}
