package controllers

import (
	"net/http"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type FriendController struct {
	service *services.FriendService
}

func NewFriendController(service *services.FriendService) *FriendController {
	return &FriendController{service: service}
}

// Send friend request
func (c *FriendController) SendRequest(ctx *gin.Context) {
	var body struct {
		Username string `json:"username"`
	}

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	// Get current user ID from context (set by auth middleware)
	userIDStr, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, err := bson.ObjectIDFromHex(userIDStr.(string))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	err = c.service.SendRequest(userID, body.Username)
	if err != nil {
		switch err.Error() {
		case "user not found":
			ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		case "cannot send friend request to yourself":
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "cannot send friend request to yourself"})
		case "already friends":
			ctx.JSON(http.StatusConflict, gin.H{"error": "already friends"})
		case "friend request already sent":
			ctx.JSON(http.StatusConflict, gin.H{"error": "friend request already sent"})
		case "this user has already sent you a friend request":
			ctx.JSON(http.StatusConflict, gin.H{"error": "this user has already sent you a friend request"})
		default:
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to send friend request"})
		}
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "friend request sent"})
}

// Accept friend request
func (c *FriendController) AcceptRequest(ctx *gin.Context) {
	requestID := ctx.Param("id")

	objID, err := bson.ObjectIDFromHex(requestID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request ID"})
		return
	}

	userIDStr, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, err := bson.ObjectIDFromHex(userIDStr.(string))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	err = c.service.AcceptRequest(objID, userID)
	if err != nil {
		switch err.Error() {
		case "friend request not found":
			ctx.JSON(http.StatusNotFound, gin.H{"error": "friend request not found"})
		case "unauthorized to accept this request":
			ctx.JSON(http.StatusForbidden, gin.H{"error": "unauthorized to accept this request"})
		case "request is no longer pending":
			ctx.JSON(http.StatusConflict, gin.H{"error": "request is no longer pending"})
		default:
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to accept friend request"})
		}
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "friend request accepted"})
}

// Reject friend request
func (c *FriendController) RejectRequest(ctx *gin.Context) {
	requestID := ctx.Param("id")

	objID, err := bson.ObjectIDFromHex(requestID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request ID"})
		return
	}

	userIDStr, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, err := bson.ObjectIDFromHex(userIDStr.(string))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	err = c.service.RejectRequest(objID, userID)
	if err != nil {
		switch err.Error() {
		case "friend request not found":
			ctx.JSON(http.StatusNotFound, gin.H{"error": "friend request not found"})
		case "unauthorized to reject this request":
			ctx.JSON(http.StatusForbidden, gin.H{"error": "unauthorized to reject this request"})
		case "request is no longer pending":
			ctx.JSON(http.StatusConflict, gin.H{"error": "request is no longer pending"})
		default:
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to reject friend request"})
		}
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "friend request rejected"})
}

// Cancel sent request
func (c *FriendController) CancelRequest(ctx *gin.Context) {
	requestID := ctx.Param("id")

	objID, err := bson.ObjectIDFromHex(requestID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request ID"})
		return
	}

	userIDStr, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, err := bson.ObjectIDFromHex(userIDStr.(string))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	err = c.service.CancelRequest(objID, userID)
	if err != nil {
		switch err.Error() {
		case "friend request not found":
			ctx.JSON(http.StatusNotFound, gin.H{"error": "friend request not found"})
		case "unauthorized to cancel this request":
			ctx.JSON(http.StatusForbidden, gin.H{"error": "unauthorized to cancel this request"})
		case "request is no longer pending":
			ctx.JSON(http.StatusConflict, gin.H{"error": "request is no longer pending"})
		default:
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to cancel friend request"})
		}
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "friend request cancelled"})
}

// Get received requests
func (c *FriendController) GetReceivedRequests(ctx *gin.Context) {
	userIDStr, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, err := bson.ObjectIDFromHex(userIDStr.(string))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	requests, err := c.service.GetReceivedRequests(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch requests"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"requests": requests})
}

// Get sent requests
func (c *FriendController) GetSentRequests(ctx *gin.Context) {
	userIDStr, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, err := bson.ObjectIDFromHex(userIDStr.(string))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	requests, err := c.service.GetSentRequests(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch requests"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"requests": requests})
}

// Get friends list
func (c *FriendController) GetFriends(ctx *gin.Context) {
	userIDStr, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, err := bson.ObjectIDFromHex(userIDStr.(string))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	friends, err := c.service.GetFriends(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch friends"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"friends": friends})
}

// Search users
func (c *FriendController) SearchUsers(ctx *gin.Context) {
	query := ctx.Query("q")
	if query == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "search query is required"})
		return
	}

	userIDStr, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, err := bson.ObjectIDFromHex(userIDStr.(string))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	users, err := c.service.SearchUsers(query, userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to search users"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"users": users})
}

// Remove friend
func (c *FriendController) RemoveFriend(ctx *gin.Context) {
	var body struct {
		Username string `json:"username"`
	}

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	userIDStr, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	userID, err := bson.ObjectIDFromHex(userIDStr.(string))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	err = c.service.RemoveFriend(userID, body.Username)
	if err != nil {
		switch err.Error() {
		case "user not found":
			ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		case "not friends with this user":
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "not friends with this user"})
		default:
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to remove friend"})
		}
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "friend removed"})
}
