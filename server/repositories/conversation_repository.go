package repositories

import (
	"context"
	"time"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type ConversationRepository struct {
	collection *mongo.Collection
}

func NewConversationRepository(client *mongo.Client, dbName string) *ConversationRepository {
	return &ConversationRepository{
		collection: client.Database(dbName).Collection("conversations"),
	}
}

func (r *ConversationRepository) Create(conversation models.Conversation) (*models.Conversation, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := r.collection.InsertOne(ctx, conversation)
	if err != nil {
		return nil, err
	}

	conversation.ID = res.InsertedID.(bson.ObjectID)
	return &conversation, nil
}

func (r *ConversationRepository) FindByUser(userID string) ([]models.Conversation, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(ctx, bson.M{
		"participants": userID,
	})
	if err != nil {
		return nil, err
	}

	var conversations []models.Conversation
	if err := cursor.All(ctx, &conversations); err != nil {
		return nil, err
	}

	return conversations, nil
}