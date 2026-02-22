package controllers

import (
	"net/http"
	"strings"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/gin-gonic/gin"
)
type AuthController struct {
	service      *services.AuthService
	tokenService *services.TokenService
}

func NewAuthController(
	service *services.AuthService,
	tokenService *services.TokenService,
) *AuthController {
	return &AuthController{
		service:      service,
		tokenService: tokenService,
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

	token, err := c.service.Login(body.Email, body.Password)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"token": token})
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