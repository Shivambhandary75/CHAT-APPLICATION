package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/controllers"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/middleware"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
)

func RegisterWSRoutes(
	r *gin.Engine,
	controller *controllers.WSController,
	tokenService *services.TokenService,
) {
	r.GET("/ws", middleware.AuthMiddleware(tokenService), controller.Handle)
}