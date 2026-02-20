package storage

import (
	"chat-app/server/models"
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepository struct {
	collection *mongo.Collection
}

// NewUserRepository creates a new user repository
func NewUserRepository(db *MongoDB) *UserRepository {
	return &UserRepository{
		collection: db.GetCollection("users"),
	}
}

// CreateUser creates a new user in the database
func (r *UserRepository) CreateUser(ctx context.Context, user *models.User) error {
	user.ID = primitive.NewObjectID()
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	user.Status = "offline"

	_, err := r.collection.InsertOne(ctx, user)
	if err != nil {
		return err
	}

	return nil
}

// FindUserByEmail finds a user by email
func (r *UserRepository) FindUserByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User
	err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}

// FindUserByID finds a user by ID
func (r *UserRepository) FindUserByID(ctx context.Context, id string) (*models.User, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("invalid user ID")
	}

	var user models.User
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}

// FindUserByUsername finds a user by username
func (r *UserRepository) FindUserByUsername(ctx context.Context, username string) (*models.User, error) {
	var user models.User
	err := r.collection.FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	return &user, nil
}

// UpdateUserStatus updates a user's online status
func (r *UserRepository) UpdateUserStatus(ctx context.Context, userID string, status string) error {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return errors.New("invalid user ID")
	}

	update := bson.M{
		"$set": bson.M{
			"status":     status,
			"updated_at": time.Now(),
		},
	}

	_, err = r.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
	return err
}

// UpdateUser updates user information
func (r *UserRepository) UpdateUser(ctx context.Context, userID string, updates bson.M) error {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return errors.New("invalid user ID")
	}

	updates["updated_at"] = time.Now()
	update := bson.M{"$set": updates}

	_, err = r.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
	return err
}

// CheckEmailExists checks if an email already exists
func (r *UserRepository) CheckEmailExists(ctx context.Context, email string) (bool, error) {
	count, err := r.collection.CountDocuments(ctx, bson.M{"email": email})
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// CheckUsernameExists checks if a username already exists
func (r *UserRepository) CheckUsernameExists(ctx context.Context, username string) (bool, error) {
	count, err := r.collection.CountDocuments(ctx, bson.M{"username": username})
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// MessageRepository handles message-related database operations
type MessageRepository struct {
	collection *mongo.Collection
}

func NewMessageRepository(db *MongoDB) *MessageRepository {
	return &MessageRepository{
		collection: db.GetCollection("messages"),
	}
}

func (r *MessageRepository) Create(ctx context.Context, message *models.Message) error {
	message.ID = primitive.NewObjectID()
	_, err := r.collection.InsertOne(ctx, message)
	return err
}

func (r *MessageRepository) GetByRoomID(ctx context.Context, roomID string, limit int) ([]*models.Message, error) {
	var messages []*models.Message
	
	cursor, err := r.collection.Find(ctx, bson.M{"room_id": roomID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &messages); err != nil {
		return nil, err
	}

	return messages, nil
}

// RoomRepository handles room-related database operations
type RoomRepository struct {
	collection *mongo.Collection
}

func NewRoomRepository(db *MongoDB) *RoomRepository {
	return &RoomRepository{
		collection: db.GetCollection("rooms"),
	}
}

func (r *RoomRepository) Create(ctx context.Context, room *models.Room) error {
	room.ID = primitive.NewObjectID()
	_, err := r.collection.InsertOne(ctx, room)
	return err
}

func (r *RoomRepository) GetByID(ctx context.Context, roomID string) (*models.Room, error) {
	objectID, err := primitive.ObjectIDFromHex(roomID)
	if err != nil {
		return nil, errors.New("invalid room ID")
	}

	var room models.Room
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&room)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("room not found")
		}
		return nil, err
	}
	return &room, nil
}
