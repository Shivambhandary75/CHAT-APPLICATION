package repositories

import (
	"context"
	"time"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type FriendRepository struct {
	friendRequestCollection *mongo.Collection
	friendshipCollection    *mongo.Collection
	userCollection          *mongo.Collection
}

func NewFriendRepository(client *mongo.Client, dbName string) *FriendRepository {
	return &FriendRepository{
		friendRequestCollection: client.Database(dbName).Collection("friend_requests"),
		friendshipCollection:    client.Database(dbName).Collection("friendships"),
		userCollection:          client.Database(dbName).Collection("users"),
	}
}

// Create a friend request
func (r *FriendRepository) CreateRequest(senderID, receiverID bson.ObjectID) error {
	request := models.FriendRequest{
		ID:         bson.NewObjectID(),
		SenderID:   senderID,
		ReceiverID: receiverID,
		Status:     "pending",
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	_, err := r.friendRequestCollection.InsertOne(context.Background(), request)
	return err
}

// Find request by sender and receiver
func (r *FriendRepository) FindRequest(senderID, receiverID bson.ObjectID) (*models.FriendRequest, error) {
	var request models.FriendRequest
	err := r.friendRequestCollection.FindOne(
		context.Background(),
		bson.M{
			"sender_id":   senderID,
			"receiver_id": receiverID,
		},
	).Decode(&request)

	if err != nil {
		return nil, err
	}
	return &request, nil
}

// Find request by ID
func (r *FriendRepository) FindRequestByID(requestID bson.ObjectID) (*models.FriendRequest, error) {
	var request models.FriendRequest
	err := r.friendRequestCollection.FindOne(
		context.Background(),
		bson.M{"_id": requestID},
	).Decode(&request)

	if err != nil {
		return nil, err
	}
	return &request, nil
}

// Update request status
func (r *FriendRepository) UpdateRequestStatus(requestID bson.ObjectID, status string) error {
	_, err := r.friendRequestCollection.UpdateOne(
		context.Background(),
		bson.M{"_id": requestID},
		bson.M{
			"$set": bson.M{
				"status":     status,
				"updated_at": time.Now(),
			},
		},
	)
	return err
}

// Delete request
func (r *FriendRepository) DeleteRequest(requestID bson.ObjectID) error {
	_, err := r.friendRequestCollection.DeleteOne(
		context.Background(),
		bson.M{"_id": requestID},
	)
	return err
}

// Get all pending requests received by user
func (r *FriendRepository) GetReceivedRequests(userID bson.ObjectID) ([]models.FriendRequest, error) {
	cursor, err := r.friendRequestCollection.Find(
		context.Background(),
		bson.M{
			"receiver_id": userID,
			"status":      "pending",
		},
	)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var requests []models.FriendRequest
	if err = cursor.All(context.Background(), &requests); err != nil {
		return nil, err
	}
	return requests, nil
}

// Get all pending requests sent by user
func (r *FriendRepository) GetSentRequests(userID bson.ObjectID) ([]models.FriendRequest, error) {
	cursor, err := r.friendRequestCollection.Find(
		context.Background(),
		bson.M{
			"sender_id": userID,
			"status":    "pending",
		},
	)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var requests []models.FriendRequest
	if err = cursor.All(context.Background(), &requests); err != nil {
		return nil, err
	}
	return requests, nil
}

// Create friendship
func (r *FriendRepository) CreateFriendship(user1ID, user2ID bson.ObjectID) error {
	friendship := models.Friendship{
		ID:        bson.NewObjectID(),
		User1ID:   user1ID,
		User2ID:   user2ID,
		CreatedAt: time.Now(),
	}

	_, err := r.friendshipCollection.InsertOne(context.Background(), friendship)
	return err
}

// Check if friendship exists
func (r *FriendRepository) FriendshipExists(user1ID, user2ID bson.ObjectID) (bool, error) {
	count, err := r.friendshipCollection.CountDocuments(
		context.Background(),
		bson.M{
			"$or": []bson.M{
				{"user1_id": user1ID, "user2_id": user2ID},
				{"user1_id": user2ID, "user2_id": user1ID},
			},
		},
	)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// Get all friends of a user
func (r *FriendRepository) GetFriends(userID bson.ObjectID) ([]bson.ObjectID, error) {
	cursor, err := r.friendshipCollection.Find(
		context.Background(),
		bson.M{
			"$or": []bson.M{
				{"user1_id": userID},
				{"user2_id": userID},
			},
		},
	)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var friendships []models.Friendship
	if err = cursor.All(context.Background(), &friendships); err != nil {
		return nil, err
	}

	var friendIDs []bson.ObjectID
	for _, friendship := range friendships {
		if friendship.User1ID == userID {
			friendIDs = append(friendIDs, friendship.User2ID)
		} else {
			friendIDs = append(friendIDs, friendship.User1ID)
		}
	}
	return friendIDs, nil
}

// Find user by username
func (r *FriendRepository) FindUserByUsername(username string) (*models.User, error) {
	var user models.User
	err := r.userCollection.FindOne(
		context.Background(),
		bson.M{"username": username},
	).Decode(&user)

	if err != nil {
		return nil, err
	}
	return &user, nil
}

// Find user by ID
func (r *FriendRepository) FindUserByID(userID bson.ObjectID) (*models.User, error) {
	var user models.User
	err := r.userCollection.FindOne(
		context.Background(),
		bson.M{"_id": userID},
	).Decode(&user)

	if err != nil {
		return nil, err
	}
	return &user, nil
}

// Find multiple users by IDs
func (r *FriendRepository) FindUsersByIDs(userIDs []bson.ObjectID) ([]models.User, error) {
	cursor, err := r.userCollection.Find(
		context.Background(),
		bson.M{"_id": bson.M{"$in": userIDs}},
	)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var users []models.User
	if err = cursor.All(context.Background(), &users); err != nil {
		return nil, err
	}
	return users, nil
}

// Search users by username
func (r *FriendRepository) SearchUsers(query string, limit int) ([]models.User, error) {
	opts := options.Find().SetLimit(int64(limit))
	cursor, err := r.userCollection.Find(
		context.Background(),
		bson.M{
			"username": bson.M{"$regex": query, "$options": "i"},
		},
		opts,
	)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var users []models.User
	if err = cursor.All(context.Background(), &users); err != nil {
		return nil, err
	}
	return users, nil
}
