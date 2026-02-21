package models

import "time"

type RevokedToken struct {
	Token     string    `bson:"token"`
	RevokedAt time.Time `bson:"revoked_at"`
}