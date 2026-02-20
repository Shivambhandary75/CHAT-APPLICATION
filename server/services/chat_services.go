package services

import (
	"chat-app/server/models"
	"chat-app/server/storage"
	"context"
	"time"
)

type ChatService struct {
	messageRepo *storage.MessageRepository
	roomRepo    *storage.RoomRepository
}

func NewChatService(messageRepo *storage.MessageRepository, roomRepo *storage.RoomRepository) *ChatService {
	return &ChatService{
		messageRepo: messageRepo,
		roomRepo:    roomRepo,
	}
}

func (s *ChatService) CreateRoom(ctx context.Context, room *models.Room) error {
	room.CreatedAt = time.Now()
	room.UpdatedAt = time.Now()
	return s.roomRepo.Create(ctx, room)
}

func (s *ChatService) GetRoomByID(ctx context.Context, roomID string) (*models.Room, error) {
	return s.roomRepo.GetByID(ctx, roomID)
}

func (s *ChatService) SaveMessage(ctx context.Context, message *models.Message) error {
	message.CreatedAt = time.Now()
	return s.messageRepo.Create(ctx, message)
}

func (s *ChatService) GetRoomMessages(ctx context.Context, roomID string, limit int) ([]*models.Message, error) {
	return s.messageRepo.GetByRoomID(ctx, roomID, limit)
}
