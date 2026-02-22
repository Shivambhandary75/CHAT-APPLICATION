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

	// Unique email index
	emailIndex := mongo.IndexModel{
		Keys:    bson.M{"email": 1},
		Options: options.Index().SetUnique(true),
	}

	// Unique username index
	usernameIndex := mongo.IndexModel{
		Keys:    bson.M{"username": 1},
		Options: options.Index().SetUnique(true),
	}

	_, err := collection.Indexes().CreateMany(
		context.Background(),
		[]mongo.IndexModel{emailIndex, usernameIndex},
	)
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

func (r *AuthRepository) FindByUsername(username string) (*models.User, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User

	err := r.collection.FindOne(ctx, bson.M{
		"username": username,
	}).Decode(&user)

	if err == mongo.ErrNoDocuments {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *AuthRepository) FindByID(userID string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	var user models.User
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *AuthRepository) UpdateDisplayName(userID string, displayName string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}

	_, err = r.collection.UpdateOne(
		ctx,
		bson.M{"_id": objectID},
		bson.M{"$set": bson.M{"display_name": displayName}},
	)
	return err
}
