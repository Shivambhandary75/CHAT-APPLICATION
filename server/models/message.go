package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Message struct {
	ID             bson.ObjectID `bson:"_id,omitempty"`
	ConversationID bson.ObjectID `bson:"conversation_id"`
	SenderID       string        `bson:"sender_id"`
	Content        string        `bson:"content"`
	CreatedAt      time.Time     `bson:"created_at"`
}