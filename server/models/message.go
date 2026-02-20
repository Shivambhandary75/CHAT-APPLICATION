package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	RoomID    string             `bson:"room_id" json:"room_id"`
	SenderID  string             `bson:"sender_id" json:"sender_id"`
	Username  string             `bson:"username" json:"username"`
	Content   string             `bson:"content" json:"content"`
	Type      string             `bson:"type" json:"type"` // text, image, file, system
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}

type Room struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name         string             `bson:"name" json:"name"`
	Type         string             `bson:"type" json:"type"` // direct, group
	Participants []string           `bson:"participants" json:"participants"`
	CreatedBy    string             `bson:"created_by" json:"created_by"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updated_at"`
}
