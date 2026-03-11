package app

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/controllers"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/middleware"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/repositories"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/routes"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/ws"
)

func RegisterModules(r *gin.Engine, client *mongo.Client, dbName string, cloudinaryURL string) {

	// ===== Token =====
	tokenRepo := repositories.NewTokenRepository(client, dbName)
	tokenService := services.NewTokenService(tokenRepo)

	// ===== Auth =====
	authRepo := repositories.NewAuthRepository(client, dbName)
	authService := services.NewAuthService(authRepo)
	authController := controllers.NewAuthController(authService, tokenService, cloudinaryURL)

	routes.RegisterAuthRoutes(r, authController, tokenService)

	// Protected test route
	r.GET("/protected-test", middleware.AuthMiddleware(tokenService), func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "protected ok"})
	})

	// ===== Conversation =====
	conversationRepo := repositories.NewConversationRepository(client, dbName)
	conversationService := services.NewConversationService(conversationRepo)

	// ===== Groups =====
	groupRepo := repositories.NewGroupRepository(client, dbName)

	// ===== Message =====
	messageRepo := repositories.NewMessageRepository(client, dbName)
	messageService := services.NewMessageService(messageRepo, conversationRepo, authRepo)
	messageController := controllers.NewMessageController(messageService, cloudinaryURL)

	// ===== Conversation Controller (needs messageService for last_message) =====
	conversationController := controllers.NewConversationController(conversationService, messageService, authRepo, groupRepo)

	routes.RegisterConversationRoutes(r, conversationController, tokenService)
	routes.RegisterMessageRoutes(r, messageController, tokenService)

	// ===== Groups =====
	groupService := services.NewGroupService(groupRepo, authRepo, conversationService)
	groupController := controllers.NewGroupController(groupService, cloudinaryURL)

	routes.RegisterGroupRoutes(r, groupController, tokenService)

	// ===== Friend Module =====
	friendRepo := repositories.NewFriendRepository(client, dbName)
	friendService := services.NewFriendService(friendRepo)
	friendController := controllers.NewFriendController(friendService)

	routes.RegisterFriendRoutes(r, friendController, tokenService)

	// ===== WebSocket Module =====
	hub := ws.NewHub()
	go hub.Run()

	wsService := services.NewWSService(hub, messageService, conversationService, authRepo)
	wsController := controllers.NewWSController(hub, wsService)

	routes.RegisterWSRoutes(r, wsController, tokenService)
	// ===== Stats Module =====
	statsRepo := repositories.NewStatsRepository(client, dbName)
	statsService := services.NewStatsService(statsRepo)
	statsController := controllers.NewStatsController(statsService)
	routes.RegisterStatsRoutes(r, statsController)
}
