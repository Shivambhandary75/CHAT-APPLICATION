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

func NewConversationController(
	service *services.ConversationService,
	msgService *services.MessageService,
	authRepo *repositories.AuthRepository,
	groupRepo *repositories.GroupRepository,
) *ConversationController {
	return &ConversationController{
		service:    service,
		msgService: msgService,
		authRepo:   authRepo,
		groupRepo:  groupRepo,
	}
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

	// Enrich with the other user's details
	enriched := ConversationEnriched{Conversation: *conversation}
	otherUser, userErr := c.authRepo.FindByID(body.RecipientID)
	if userErr == nil && otherUser != nil {
		enriched.DisplayName = otherUser.DisplayName
		enriched.Username = otherUser.Username
		enriched.PhotoURL = otherUser.PhotoURL
	}

	ctx.JSON(http.StatusOK, enriched)
}

type ConversationEnriched struct {
	models.Conversation
	LastMessage *models.Message `json:"last_message,omitempty"`
	DisplayName string          `json:"display_name,omitempty"`
	Username    string          `json:"username,omitempty"`
	PhotoURL    string          `json:"photo_url,omitempty"`
}

func (c *ConversationController) GetUserConversations(ctx *gin.Context) {

	userID := ctx.GetString("user_id")

	conversations, err := c.service.GetUserConversations(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch conversations"})
		return
	}

	result := make([]ConversationEnriched, 0, len(conversations))
	for _, conv := range conversations {
		enriched := ConversationEnriched{Conversation: conv}
		convID := conv.ID.Hex()
		lastMsg, _ := c.msgService.GetLatestMessage(convID)
		enriched.LastMessage = lastMsg

		if conv.Type == "direct" {
			// Find the other participant
			var otherID string
			for _, p := range conv.Participants {
				if p != userID {
					otherID = p
					break
				}
			}
			if otherID != "" {
				user, err := c.authRepo.FindByID(otherID)
				if err == nil && user != nil {
					enriched.DisplayName = user.DisplayName
					enriched.Username = user.Username
					enriched.PhotoURL = user.PhotoURL
				}
			}
		} else if conv.Type == "group" {
			// Find group info
			if conv.GroupID != "" {
				group, err := c.groupRepo.FindByID(conv.GroupID)
				if err == nil && group != nil {
					enriched.DisplayName = group.Name
					// Group's name
					enriched.PhotoURL = group.Photo
				}
			}
		}

		result = append(result, enriched)
	}

	ctx.JSON(http.StatusOK, result)
}

