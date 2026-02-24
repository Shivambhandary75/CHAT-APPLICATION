package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/utils"
	"github.com/gin-gonic/gin"
)

type GroupController struct {
	service       *services.GroupService
	cloudinaryURL string
}

func NewGroupController(service *services.GroupService, cloudinaryURL string) *GroupController {
	return &GroupController{service: service, cloudinaryURL: cloudinaryURL}
}

func (c *GroupController) CreateGroup(ctx *gin.Context) {
	var body struct {
		Name        string   `json:"name"`
		Description string   `json:"description"`
		AvatarColor string   `json:"avatar_color"`
		MemberIDs   []string `json:"member_ids"`
	}

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	if body.Name == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "group name is required"})
		return
	}

	userID := ctx.GetString("user_id")
	if userID == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "user not authenticated"})
		return
	}

	group, err := c.service.CreateGroup(userID, body.Name, body.Description, body.AvatarColor, body.MemberIDs)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, group)
}

func (c *GroupController) GetUserGroups(ctx *gin.Context) {
	userID := ctx.GetString("user_id")

	groups, err := c.service.GetUserGroups(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch groups"})
		return
	}

	// Always return an array, never null
	if groups == nil {
		groups = []models.Group{}
	}

	ctx.JSON(http.StatusOK, groups)
}

func (c *GroupController) GetGroupByID(ctx *gin.Context) {
	group, err := c.service.GetGroupByID(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "group not found"})
		return
	}

	ctx.JSON(http.StatusOK, group)
}

func (c *GroupController) UpdateGroup(ctx *gin.Context) {
	name := ctx.PostForm("name")
	description := ctx.PostForm("description")
	avatarColor := ctx.PostForm("avatar_color")

	var memberIDs []string
	if raw := ctx.PostForm("member_ids"); raw != "" {
		if err := json.Unmarshal([]byte(raw), &memberIDs); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid member_ids"})
			return
		}
	}

	// Upload photo to Cloudinary if provided
	photoURL := ""
	header, err := ctx.FormFile("photo")
	if err == nil && header != nil {
		file, openErr := header.Open()
		if openErr != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to open photo"})
			return
		}
		defer file.Close()
		mimeType := header.Header.Get("Content-Type")
		if mimeType == "" {
			mimeType = "image/jpeg"
		}
		url, _, uploadErr := utils.UploadFile(c.cloudinaryURL, file, "group_photos", mimeType)
		if uploadErr != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload photo"})
			return
		}
		photoURL = url
	}

	group, err := c.service.UpdateGroup(ctx.Param("id"), name, description, photoURL, avatarColor, memberIDs)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update group"})
		return
	}

	ctx.JSON(http.StatusOK, group)
}

func (c *GroupController) LeaveGroup(ctx *gin.Context) {
	if err := c.service.LeaveGroup(ctx.Param("id"), ctx.GetString("user_id")); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to leave group"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "left group successfully"})
}

func (c *GroupController) GetGroupMembers(ctx *gin.Context) {
	members, err := c.service.GetGroupMembers(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch members"})
		return
	}
	ctx.JSON(http.StatusOK, members)
}

func (c *GroupController) GetGroupConversation(ctx *gin.Context) {
	conversation, err := c.service.GetGroupConversation(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get group conversation"})
		return
	}
	ctx.JSON(http.StatusOK, conversation)
}
