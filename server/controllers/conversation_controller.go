package controllers

import (
	"net/http"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/gin-gonic/gin"
)

type ConversationController struct {
	service *services.ConversationService
}

func NewConversationController(service *services.ConversationService) *ConversationController {
	return &ConversationController{service: service}
}

func (c *ConversationController) CreateDirect(ctx *gin.Context) {

	var body struct {
		RecipientID string `json:"recipient_id"`
	}

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	userID := ctx.GetString("user_id")

	conversation, err := c.service.CreateDirectConversation(userID, body.RecipientID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create conversation"})
		return
	}

	ctx.JSON(http.StatusOK, conversation)
}

func (c *ConversationController) GetUserConversations(ctx *gin.Context) {

	userID := ctx.GetString("user_id")

	conversations, err := c.service.GetUserConversations(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch conversations"})
		return
	}

	ctx.JSON(http.StatusOK, conversations)
}
