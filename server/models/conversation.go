package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Conversation struct {
	ID           bson.ObjectID        `bson:"_id,omitempty" json:"id"`
	Type         string               `bson:"type"          json:"type"`
	Name         string               `bson:"name,omitempty" json:"name,omitempty"`
	GroupID      string               `bson:"group_id,omitempty" json:"group_id,omitempty"`
	Participants []string             `bson:"participants"  json:"participants"`
	CreatedAt    time.Time            `bson:"created_at"    json:"created_at"`
	// per-user clear-chat timestamp; messages older than this are hidden for that user
	ClearedAt    map[string]time.Time `bson:"cleared_at,omitempty" json:"cleared_at,omitempty"`
}
