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

func (mc *MessageController) SendMessage(c *gin.Context) {
	var body struct {
		RoomID   string `json:"room_id"`
		Username string `json:"username"`
		Content  string `json:"content"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if err := mc.service.SendMessage(body.RoomID, body.Username, body.Content); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "message saved"})
}

func (mc *MessageController) GetMessages(c *gin.Context) {
	roomID := c.Param("room_id")

	messages, err := mc.service.GetMessages(roomID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch messages"})
		return
	}

	c.JSON(http.StatusOK, messages)
}