package routes

import (
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/controllers"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/middleware"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/gin-gonic/gin"
)

func RegisterConversationRoutes(
	r *gin.Engine,
	controller *controllers.ConversationController,
	tokenService *services.TokenService,
) {

	conv := r.Group("/conversations")
	conv.Use(middleware.AuthMiddleware(tokenService))
	{
		conv.POST("", controller.CreateDirect)
		conv.GET("", controller.GetUserConversations)
	}
}