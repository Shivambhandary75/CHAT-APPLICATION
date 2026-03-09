package controllers

import (
	"net/http"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/utils"
	"github.com/gin-gonic/gin"
)

type MessageController struct {
	service       *services.MessageService
	cloudinaryURL string
}

func NewMessageController(service *services.MessageService, cloudinaryURL string) *MessageController {
	return &MessageController{service: service, cloudinaryURL: cloudinaryURL}
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

	err := c.service.SendMessage(conversationID, userID, body.Content, "", "")
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
		if err.Error() == "unauthorized" {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "not a participant in this conversation"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, messages)
}

func (c *MessageController) ClearChat(ctx *gin.Context) {

	conversationID := ctx.Param("conversation_id")
	userID := ctx.GetString("user_id")

	if err := c.service.ClearMessages(conversationID, userID); err != nil {
		if err.Error() == "unauthorized" {
			ctx.JSON(http.StatusForbidden, gin.H{"error": "unauthorized"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to clear chat"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "chat cleared"})
}

// UploadAttachment accepts multipart/form-data with a "file" field,
// uploads it to Cloudinary, and returns { url, type }.
func (c *MessageController) UploadAttachment(ctx *gin.Context) {

	fileHeader, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}

	mimeType := fileHeader.Header.Get("Content-Type")

	file, err := fileHeader.Open()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to open file"})
		return
	}
	defer file.Close()

	secureURL, resourceType, err := utils.UploadFile(c.cloudinaryURL, file, "chat-attachments", mimeType)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "upload failed: " + err.Error()})
		return
	}

	// Return a friendly type the client can switch on: "image", "video", "pdf"
	attachType := resourceType // "image" or "video"
	if mimeType == "application/pdf" {
		attachType = "pdf"
	}

	ctx.JSON(http.StatusOK, gin.H{
		"url":  secureURL,
		"type": attachType,
	})
}
