package routes

import (
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/controllers"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/middleware"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(r *gin.Engine, controller *controllers.AuthController, tokenService *services.TokenService) {
	auth := r.Group("/auth")
	{
		auth.POST("/register", controller.Register)
		auth.POST("/login", controller.Login)
		auth.POST("/logout", controller.Logout)
		auth.GET("/verify", middleware.AuthMiddleware(tokenService), controller.Verify)
		auth.GET("/profile", middleware.AuthMiddleware(tokenService), controller.GetProfile)
		auth.PUT("/profile", middleware.AuthMiddleware(tokenService), controller.UpdateProfile)
	}
}
