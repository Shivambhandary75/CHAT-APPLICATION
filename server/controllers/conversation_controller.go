package controllers

import (
	"net/http"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/repositories"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/gin-gonic/gin"
)

type ConversationController struct {
	service    *services.ConversationService
	msgService *services.MessageService
	authRepo   *repositories.AuthRepository
	groupRepo  *repositories.GroupRepository
}

func NewConversationController(service *services.ConversationService, msgService *services.MessageService, authRepo *repositories.AuthRepository, groupRepo *repositories.GroupRepository) *ConversationController {
	return &ConversationController{service: service, msgService: msgService, authRepo: authRepo, groupRepo: groupRepo}
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

type ParticipantInfo struct {
	ID          string `json:"id"`
	Username    string `json:"username"`
	DisplayName string `json:"display_name"`
	PhotoURL    string `json:"photo_url,omitempty"`
}

type ConversationWithLastMessage struct {
	models.Conversation
	LastMessage      *models.Message   `json:"last_message,omitempty"`
	ParticipantInfos []ParticipantInfo `json:"participant_infos,omitempty"`
	GroupPhoto       string            `json:"group_photo,omitempty"`
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

		// Enrich with participant user details
		if c.authRepo != nil && len(conv.Participants) > 0 {
			users, err := c.authRepo.FindUsersByIDs(conv.Participants)
			if err == nil {
				for _, u := range users {
					enriched.ParticipantInfos = append(enriched.ParticipantInfos, ParticipantInfo{
						ID:          u.ID.Hex(),
						Username:    u.Username,
						DisplayName: u.DisplayName,
						PhotoURL:    u.PhotoURL,
					})
				}
			}
		}

		// For group conversations, attach the group's photo
		if conv.Type == "group" && conv.GroupID != "" && c.groupRepo != nil {
			if grp, err := c.groupRepo.FindByID(conv.GroupID); err == nil && grp != nil {
				enriched.GroupPhoto = grp.Photo
			}
		}

		result = append(result, enriched)
	}

	ctx.JSON(http.StatusOK, result)
}
