package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type User struct {
	ID          bson.ObjectID `bson:"_id,omitempty"`
	Username    string        `bson:"username"`      // unique
	DisplayName string        `bson:"display_name"`  // not unique
	Email       string        `bson:"email"`         // unique
	Password    string        `bson:"password"`
	CreatedAt   time.Time     `bson:"created_at"`
}