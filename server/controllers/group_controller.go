package controllers

import (
	"net/http"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/gin-gonic/gin"
)

type GroupController struct {
	service *services.GroupService
}

func NewGroupController(service *services.GroupService) *GroupController {
	return &GroupController{service: service}
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
	var body struct {
		Name        string   `json:"name"`
		Description string   `json:"description"`
		Photo       string   `json:"photo"`
		AvatarColor string   `json:"avatar_color"`
		MemberIDs   []string `json:"member_ids"`
	}

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	group, err := c.service.UpdateGroup(ctx.Param("id"), body.Name, body.Description, body.Photo, body.AvatarColor, body.MemberIDs)
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
