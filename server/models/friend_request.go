package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type FriendRequest struct {
	ID         bson.ObjectID `bson:"_id,omitempty" json:"id"`
	SenderID   bson.ObjectID `bson:"sender_id" json:"sender_id"`
	ReceiverID bson.ObjectID `bson:"receiver_id" json:"receiver_id"`
	Status     string        `bson:"status" json:"status"` // "pending", "accepted", "rejected"
	CreatedAt  time.Time     `bson:"created_at" json:"created_at"`
	UpdatedAt  time.Time     `bson:"updated_at" json:"updated_at"`
}

type Friendship struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"id"`
	User1ID   bson.ObjectID `bson:"user1_id" json:"user1_id"`
	User2ID   bson.ObjectID `bson:"user2_id" json:"user2_id"`
	CreatedAt time.Time     `bson:"created_at" json:"created_at"`
}

// For API responses
type FriendRequestResponse struct {
	ID          string    `json:"id"`
	SenderID    string    `json:"sender_id"`
	ReceiverID  string    `json:"receiver_id"`
	Username    string    `json:"username"`
	DisplayName string    `json:"display_name"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
}

type FriendResponse struct {
	ID          string `json:"id"`
	Username    string `json:"username"`
	DisplayName string `json:"display_name"`
	Email       string `json:"email"`
	PhotoURL    string `json:"photo_url,omitempty"`
	Status      string `json:"status"` // "online" or "offline"
}
