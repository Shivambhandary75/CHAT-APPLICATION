package controllers

import (
	"net/http"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/gin-gonic/gin"
)

type MessageController struct {
	service *services.MessageService
}

func NewMessageController(service *services.MessageService) *MessageController {
	return &MessageController{service: service}
}

func (c *MessageController) SendMessage(ctx *gin.Context) {

	conversationID := ctx.Param("conversation_id")
	userID := ctx.GetString("user_id")

	var body struct {
		Content string `json:"content"`
	}

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	err := c.service.SendMessage(conversationID, userID, body.Content)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to send message"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "message sent"})
}

func (c *MessageController) GetMessages(ctx *gin.Context) {

	conversationID := ctx.Param("conversation_id")

	userID := ctx.GetString("user_id")
	messages, err := c.service.GetMessages(conversationID, userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch messages"})
		return
	}

	ctx.JSON(http.StatusOK, messages)
}