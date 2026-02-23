package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Message struct {
    ID             bson.ObjectID `bson:"_id,omitempty" json:"id"`
    ConversationID bson.ObjectID `bson:"conversation_id" json:"conversation_id"`
    SenderID       string        `bson:"sender_id" json:"sender_id"`
    Content        string        `bson:"content" json:"content"`
    CreatedAt      time.Time     `bson:"created_at" json:"created_at"`
}