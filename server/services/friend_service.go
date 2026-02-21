package services

import (
	"errors"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/repositories"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type FriendService struct {
	repo *repositories.FriendRepository
}

func NewFriendService(repo *repositories.FriendRepository) *FriendService {
	return &FriendService{repo: repo}
}

// Send friend request
func (s *FriendService) SendRequest(senderID bson.ObjectID, receiverUsername string) error {
	// Find receiver by username
	receiver, err := s.repo.FindUserByUsername(receiverUsername)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return errors.New("user not found")
		}
		return err
	}

	// Check if trying to add self
	if senderID == receiver.ID {
		return errors.New("cannot send friend request to yourself")
	}

	// Check if already friends
	isFriend, err := s.repo.FriendshipExists(senderID, receiver.ID)
	if err != nil {
		return err
	}
	if isFriend {
		return errors.New("already friends")
	}

	// Check if request already exists (both directions)
	existingRequest, _ := s.repo.FindRequest(senderID, receiver.ID)
	if existingRequest != nil {
		return errors.New("friend request already sent")
	}

	reverseRequest, _ := s.repo.FindRequest(receiver.ID, senderID)
	if reverseRequest != nil {
		return errors.New("this user has already sent you a friend request")
	}

	// Create friend request
	return s.repo.CreateRequest(senderID, receiver.ID)
}

// Accept friend request
func (s *FriendService) AcceptRequest(requestID bson.ObjectID, userID bson.ObjectID) error {
	// Find request
	request, err := s.repo.FindRequestByID(requestID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return errors.New("friend request not found")
		}
		return err
	}

	// Verify user is the receiver
	if request.ReceiverID != userID {
		return errors.New("unauthorized to accept this request")
	}

	// Verify request is pending
	if request.Status != "pending" {
		return errors.New("request is no longer pending")
	}

	// Create friendship
	err = s.repo.CreateFriendship(request.SenderID, request.ReceiverID)
	if err != nil {
		return err
	}

	// Delete the request after accepting
	return s.repo.DeleteRequest(requestID)
}

// Reject friend request
func (s *FriendService) RejectRequest(requestID bson.ObjectID, userID bson.ObjectID) error {
	// Find request
	request, err := s.repo.FindRequestByID(requestID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return errors.New("friend request not found")
		}
		return err
	}

	// Verify user is the receiver
	if request.ReceiverID != userID {
		return errors.New("unauthorized to reject this request")
	}

	// Verify request is pending
	if request.Status != "pending" {
		return errors.New("request is no longer pending")
	}

	// Delete the request
	return s.repo.DeleteRequest(requestID)
}

// Cancel sent request
func (s *FriendService) CancelRequest(requestID bson.ObjectID, userID bson.ObjectID) error {
	// Find request
	request, err := s.repo.FindRequestByID(requestID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return errors.New("friend request not found")
		}
		return err
	}

	// Verify user is the sender
	if request.SenderID != userID {
		return errors.New("unauthorized to cancel this request")
	}

	// Verify request is pending
	if request.Status != "pending" {
		return errors.New("request is no longer pending")
	}

	// Delete the request
	return s.repo.DeleteRequest(requestID)
}

// Get received requests with sender info
func (s *FriendService) GetReceivedRequests(userID bson.ObjectID) ([]models.FriendRequestResponse, error) {
	requests, err := s.repo.GetReceivedRequests(userID)
	if err != nil {
		return nil, err
	}

	var result []models.FriendRequestResponse
	for _, req := range requests {
		sender, err := s.repo.FindUserByID(req.SenderID)
		if err != nil {
			continue
		}

		result = append(result, models.FriendRequestResponse{
			ID:          req.ID.Hex(),
			SenderID:    req.SenderID.Hex(),
			ReceiverID:  req.ReceiverID.Hex(),
			Username:    sender.Username,
			DisplayName: sender.DisplayName,
			Status:      req.Status,
			CreatedAt:   req.CreatedAt,
		})
	}

	return result, nil
}

// Get sent requests with receiver info
func (s *FriendService) GetSentRequests(userID bson.ObjectID) ([]models.FriendRequestResponse, error) {
	requests, err := s.repo.GetSentRequests(userID)
	if err != nil {
		return nil, err
	}

	var result []models.FriendRequestResponse
	for _, req := range requests {
		receiver, err := s.repo.FindUserByID(req.ReceiverID)
		if err != nil {
			continue
		}

		result = append(result, models.FriendRequestResponse{
			ID:          req.ID.Hex(),
			SenderID:    req.SenderID.Hex(),
			ReceiverID:  req.ReceiverID.Hex(),
			Username:    receiver.Username,
			DisplayName: receiver.DisplayName,
			Status:      req.Status,
			CreatedAt:   req.CreatedAt,
		})
	}

	return result, nil
}

// Get friends list
func (s *FriendService) GetFriends(userID bson.ObjectID) ([]models.FriendResponse, error) {
	friendIDs, err := s.repo.GetFriends(userID)
	if err != nil {
		return nil, err
	}

	if len(friendIDs) == 0 {
		return []models.FriendResponse{}, nil
	}

	friends, err := s.repo.FindUsersByIDs(friendIDs)
	if err != nil {
		return nil, err
	}

	var result []models.FriendResponse
	for _, friend := range friends {
		result = append(result, models.FriendResponse{
			ID:          friend.ID.Hex(),
			Username:    friend.Username,
			DisplayName: friend.DisplayName,
			Email:       friend.Email,
			Status:      "offline", // TODO: implement online status tracking
		})
	}

	return result, nil
}

// Search users
func (s *FriendService) SearchUsers(query string, currentUserID bson.ObjectID) ([]models.FriendResponse, error) {
	users, err := s.repo.SearchUsers(query, 20)
	if err != nil {
		return nil, err
	}

	var result []models.FriendResponse
	for _, user := range users {
		// Skip current user
		if user.ID == currentUserID {
			continue
		}

		result = append(result, models.FriendResponse{
			ID:          user.ID.Hex(),
			Username:    user.Username,
			DisplayName: user.DisplayName,
			Email:       user.Email,
			Status:      "offline",
		})
	}

	return result, nil
}

// Remove friend
func (s *FriendService) RemoveFriend(userID bson.ObjectID, friendUsername string) error {
	// Find friend by username
	friend, err := s.repo.FindUserByUsername(friendUsername)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return errors.New("user not found")
		}
		return err
	}

	// Check if they are friends
	isFriend, err := s.repo.FriendshipExists(userID, friend.ID)
	if err != nil {
		return err
	}
	if !isFriend {
		return errors.New("not friends with this user")
	}

	// Delete the friendship
	return s.repo.DeleteFriendship(userID, friend.ID)
}
