package repositories

import (
	"context"
	"time"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type GroupRepository struct {
	col *mongo.Collection
}

func NewGroupRepository(client *mongo.Client, dbName string) *GroupRepository {
	return &GroupRepository{
		col: client.Database(dbName).Collection("groups"),
	}
}

func (r *GroupRepository) Create(g models.Group) (*models.Group, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := r.col.InsertOne(ctx, g)
	if err != nil {
		return nil, err
	}

	g.ID = res.InsertedID.(bson.ObjectID)
	return &g, nil
}

func (r *GroupRepository) FindByMember(userID string) ([]models.Group, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.col.Find(ctx, bson.M{"members": userID})
	if err != nil {
		return nil, err
	}

	var groups []models.Group
	if err := cursor.All(ctx, &groups); err != nil {
		return nil, err
	}

	return groups, nil
}

func (r *GroupRepository) FindByID(groupID string) (*models.Group, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := bson.ObjectIDFromHex(groupID)
	if err != nil {
		return nil, err
	}

	var g models.Group
	if err := r.col.FindOne(ctx, bson.M{"_id": objID}).Decode(&g); err != nil {
		return nil, err
	}

	return &g, nil
}

func (r *GroupRepository) Update(groupID string, update bson.M) (*models.Group, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := bson.ObjectIDFromHex(groupID)
	if err != nil {
		return nil, err
	}

	if _, err := r.col.UpdateOne(ctx, bson.M{"_id": objID}, bson.M{"$set": update}); err != nil {
		return nil, err
	}

	return r.FindByID(groupID)
}

func (r *GroupRepository) RemoveMember(groupID, userID string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := bson.ObjectIDFromHex(groupID)
	if err != nil {
		return err
	}

	_, err = r.col.UpdateOne(ctx,
		bson.M{"_id": objID},
		bson.M{"$pull": bson.M{"members": userID}},
	)
	return err
}
