package controllers

import (
	"net/http"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/gin-gonic/gin"
)

type ConversationController struct {
	service    *services.ConversationService
	msgService *services.MessageService
}

func NewConversationController(service *services.ConversationService, msgService *services.MessageService) *ConversationController {
	return &ConversationController{service: service, msgService: msgService}
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

type ConversationWithLastMessage struct {
	models.Conversation
	LastMessage *models.Message `json:"last_message,omitempty"`
}

func (c *ConversationController) GetUserConversations(ctx *gin.Context) {

	userID := ctx.GetString("user_id")

	conversations, err := c.service.GetUserConversations(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch conversations"})
		return
	}

	result := make([]ConversationWithLastMessage, 0, len(conversations))
	for _, conv := range conversations {
		enriched := ConversationWithLastMessage{Conversation: conv}
		convID := conv.ID.Hex()
		lastMsg, _ := c.msgService.GetLatestMessage(convID)
		enriched.LastMessage = lastMsg
		result = append(result, enriched)
	}

	ctx.JSON(http.StatusOK, result)
}
