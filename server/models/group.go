package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Group struct {
	ID          bson.ObjectID `bson:"_id,omitempty"         json:"id"`
	Name        string        `bson:"name"                  json:"name"`
	Description string        `bson:"description,omitempty" json:"description,omitempty"`
	Photo       string        `bson:"photo,omitempty"       json:"photo,omitempty"`
	AvatarColor string        `bson:"avatar_color,omitempty" json:"avatar_color,omitempty"`
	Members     []string      `bson:"members"               json:"members"`
	CreatedBy   string        `bson:"created_by"            json:"created_by"`
	CreatedAt   time.Time     `bson:"created_at"            json:"created_at"`
}
