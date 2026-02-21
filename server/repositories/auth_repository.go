package repositories

import (
	"context"
	"time"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type AuthRepository struct {
	collection *mongo.Collection
}

func NewAuthRepository(client *mongo.Client, dbName string) *AuthRepository {

	collection := client.Database(dbName).Collection("users")

	indexModel := mongo.IndexModel{
		Keys: bson.M{"email": 1},
		Options: options.Index().SetUnique(true),
	}

	_, err := collection.Indexes().CreateOne(context.Background(), indexModel)
	if err != nil {
		panic(err)
	}

	return &AuthRepository{
		collection: collection,
	}
}

func (r *AuthRepository) Create(user models.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.collection.InsertOne(ctx, user)
	return err
}

func (r *AuthRepository) FindByEmail(email string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User

	err := r.collection.FindOne(ctx, bson.M{
		"email": email,
	}).Decode(&user)

	if err == mongo.ErrNoDocuments {
		return nil, nil // important: no error, just no user
	}

	if err != nil {
		return nil, err
	}

	return &user, nil
}