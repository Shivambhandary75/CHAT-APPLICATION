package repositories

import (
	"context"
	"time"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type TokenRepository struct {
	collection *mongo.Collection
}

func NewTokenRepository(client *mongo.Client, dbName string) *TokenRepository {
	return &TokenRepository{
		collection: client.Database(dbName).Collection("revoked_tokens"),
	}
}

func (r *TokenRepository) Revoke(token string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.collection.InsertOne(ctx, models.RevokedToken{
		Token:     token,
		RevokedAt: time.Now(),
	})

	return err
}

func (r *TokenRepository) IsRevoked(token string) (bool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := r.collection.FindOne(ctx, bson.M{"token": token}).Err()

	if err == mongo.ErrNoDocuments {
		return false, nil
	}

	if err != nil {
		return false, err
	}

	return true, nil
}