package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Conversation struct {
	ID           bson.ObjectID		`bson:"_id,omitempty"`
	Type         string             `bson:"type"` // "direct", "group"
	Participants []string           `bson:"participants"`
	CreatedAt    time.Time          `bson:"created_at"`
}