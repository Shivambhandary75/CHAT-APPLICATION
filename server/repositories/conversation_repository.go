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

func (r *ConversationRepository) IsParticipant(
	conversationID bson.ObjectID,
	userID string,
) (bool, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	count, err := r.collection.CountDocuments(ctx, bson.M{
		"_id":          conversationID,
		"participants": userID,
	})
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *ConversationRepository) FindDirectConversation(participants []string) (*models.Conversation, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var conversation models.Conversation

	err := r.collection.FindOne(ctx, bson.M{
		"type":         "direct",
		"participants": participants,
	}).Decode(&conversation)

	if err == mongo.ErrNoDocuments {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return &conversation, nil
}

func (r *ConversationRepository) GetParticipants(conversationID string) ([]string, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := bson.ObjectIDFromHex(conversationID)
	if err != nil {
		return nil, err
	}

	var conversation models.Conversation
	err = r.collection.FindOne(ctx, bson.M{
		"_id": objID,
	}).Decode(&conversation)
	if err != nil {
		return nil, err
	}

	return conversation.Participants, nil
}

func (r *ConversationRepository) FindByGroupID(groupID string) (*models.Conversation, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var conversation models.Conversation
	err := r.collection.FindOne(ctx, bson.M{
		"type":     "group",
		"group_id": groupID,
	}).Decode(&conversation)

	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &conversation, nil
}

func (r *ConversationRepository) UpdateParticipants(conversationID bson.ObjectID, participants []string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": conversationID},
		bson.M{"$set": bson.M{"participants": participants}},
	)
	return err
}

// SetUserClearedAt records the time at which userID cleared the chat.
// Messages with created_at <= this time will be hidden for that user only.
func (r *ConversationRepository) SetUserClearedAt(conversationID bson.ObjectID, userID string, t time.Time) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": conversationID},
		bson.M{"$set": bson.M{"cleared_at." + userID: t}},
	)
	return err
}

// GetUserClearedAt returns the cleared_at time for userID in the given conversation,
// or nil if the user has never cleared.
func (r *ConversationRepository) GetUserClearedAt(conversationID bson.ObjectID, userID string) (*time.Time, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var conv models.Conversation
	err := r.collection.FindOne(ctx, bson.M{"_id": conversationID}).Decode(&conv)
	if err != nil {
		return nil, err
	}

	if conv.ClearedAt != nil {
		if t, ok := conv.ClearedAt[userID]; ok {
			return &t, nil
		}
	}
	return nil, nil
}
