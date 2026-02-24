package repositories

import (
	"context"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type StatsRepository struct {
	db *mongo.Database
}

func NewStatsRepository(client *mongo.Client, dbName string) *StatsRepository {
	return &StatsRepository{
		db: client.Database(dbName),
	}
}

func (r *StatsRepository) GetTotalUsers(ctx context.Context) (int64, error) {
	return r.db.Collection("users").CountDocuments(ctx, bson.M{})
}

func (r *StatsRepository) GetTotalMessages(ctx context.Context) (int64, error) {
	return r.db.Collection("messages").CountDocuments(ctx, bson.M{})
}

func (r *StatsRepository) GetTotalGroups(ctx context.Context) (int64, error) {
	return r.db.Collection("groups").CountDocuments(ctx, bson.M{})
}
