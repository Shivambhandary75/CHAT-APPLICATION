package routes

import (
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(r *gin.Engine, controller *controllers.AuthController) {
	auth := r.Group("/auth")
	{
		auth.POST("/register", controller.Register)
		auth.POST("/login", controller.Login)
		auth.POST("/logout", controller.Logout)
	}
}