package repositories

import (
	"context"
	"time"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type MessageRepository struct {
	collection *mongo.Collection
}

func NewMessageRepository(client *mongo.Client, dbName string) *MessageRepository {
	return &MessageRepository{
		collection: client.Database(dbName).Collection("messages"),
	}
}

func (r *MessageRepository) Create(message models.Message) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.collection.InsertOne(ctx, message)
	return err
}

func (r *MessageRepository) FindByConversation(conversationID bson.ObjectID) ([]models.Message, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(ctx, bson.M{
		"conversation_id": conversationID,
	})
	if err != nil {
		return nil, err
	}

	var messages []models.Message
	if err := cursor.All(ctx, &messages); err != nil {
		return nil, err
	}

	return messages, nil
}
