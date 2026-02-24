package controllers

import (
	"net/http"
	"strings"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/utils"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	service        *services.AuthService
	tokenService   *services.TokenService
	cloudinaryURL  string
}

func NewAuthController(
	service *services.AuthService,
	tokenService *services.TokenService,
	cloudinaryURL string,
) *AuthController {
	return &AuthController{
		service:       service,
		tokenService:  tokenService,
		cloudinaryURL: cloudinaryURL,
	}
}

func (c *AuthController) Register(ctx *gin.Context) {
	var body struct {
		Username    string `json:"username"`
		DisplayName string `json:"display_name"`
		Email       string `json:"email"`
		Password    string `json:"password"`
	}

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	err := c.service.Register(body.Username, body.DisplayName, body.Email, body.Password)
	if err != nil {
		if err.Error() == "email already exists" ||
			err.Error() == "username already exists" {

			ctx.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "registration failed"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "registered"})
}

func (c *AuthController) Login(ctx *gin.Context) {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	token, userID, err := c.service.Login(body.Email, body.Password)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"token": token, "user_id": userID})
}

func (c *AuthController) Logout(ctx *gin.Context) {

	authHeader := ctx.GetHeader("Authorization")
	if authHeader == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "missing token"})
		return
	}

	token := strings.Split(authHeader, " ")[1]

	err := c.tokenService.Revoke(token)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "logout failed"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "logged out"})
}

func (c *AuthController) Verify(ctx *gin.Context) {
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"valid": true, "user_id": userID})
}

func (c *AuthController) GetProfile(ctx *gin.Context) {
	userID := ctx.GetString("user_id")
	if userID == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	user, err := c.service.GetProfile(userID)
	if err != nil || user == nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get profile"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"id":           user.ID.Hex(),
		"username":     user.Username,
		"display_name": user.DisplayName,
		"email":        user.Email,
		"photo_url":    user.PhotoURL,
	})
}

func (c *AuthController) UpdateProfile(ctx *gin.Context) {
	userID := ctx.GetString("user_id")
	if userID == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	displayName := ctx.PostForm("display_name")

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
		url, _, uploadErr := utils.UploadFile(c.cloudinaryURL, file, "profile_photos", mimeType)
		if uploadErr != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload photo"})
			return
		}
		photoURL = url
	}

	if displayName == "" && photoURL == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "nothing to update"})
		return
	}

	if err := c.service.UpdateProfile(userID, displayName, photoURL); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "profile updated", "photo_url": photoURL})
}
