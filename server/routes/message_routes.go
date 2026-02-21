package routes

import (
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/controllers"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/middleware"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/gin-gonic/gin"
)

func RegisterMessageRoutes(
	r *gin.Engine,
	controller *controllers.MessageController,
	tokenService *services.TokenService,
) {

	msg := r.Group("/conversations/:conversation_id/messages")
	msg.Use(middleware.AuthMiddleware(tokenService))
	{
		msg.POST("", controller.SendMessage)
		msg.GET("", controller.GetMessages)
	}
}