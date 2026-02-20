package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Username  string             `bson:"username" json:"username"`
	Email     string             `bson:"email" json:"email"`
	Password  string             `bson:"password" json:"-"` // Never send password in JSON
	Avatar    string             `bson:"avatar,omitempty" json:"avatar,omitempty"`
	Friends   []string           `bson:"friends,omitempty" json:"friends,omitempty"`
	Groups    []string           `bson:"groups,omitempty" json:"groups,omitempty"`
	Requests  []FriendRequest    `bson:"requests,omitempty" json:"requests,omitempty"`
	Status    string             `bson:"status" json:"status"` // online, offline, away
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}

type FriendRequest struct {
	UserID    string    `bson:"user_id" json:"user_id"`
	Username  string    `bson:"username" json:"username"`
	Status    string    `bson:"status" json:"status"` // pending, accepted, rejected
	CreatedAt time.Time `bson:"created_at" json:"created_at"`
}

// LoginRequest represents the login payload
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// SignupRequest represents the signup payload
type SignupRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthResponse represents the authentication response
type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
