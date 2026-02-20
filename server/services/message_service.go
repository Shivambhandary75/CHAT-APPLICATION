package services

import (
	"time"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/repositories"
)

type MessageService struct {
	repo *repositories.MessageRepository
}

func NewMessageService(repo *repositories.MessageRepository) *MessageService {
	return &MessageService{repo: repo}
}

func (s *MessageService) SendMessage(roomID, username, content string) error {
	message := models.Message{
		RoomID:    roomID,
		Username:  username,
		Content:   content,
		CreatedAt: time.Now(),
	}

	return s.repo.Insert(message)
}

func (s *MessageService) GetMessages(roomID string) ([]models.Message, error) {
	return s.repo.FindByRoom(roomID)
}