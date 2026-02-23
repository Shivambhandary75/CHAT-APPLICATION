package routes

import (
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/controllers"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/middleware"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/gin-gonic/gin"
)

func RegisterGroupRoutes(
	r *gin.Engine,
	controller *controllers.GroupController,
	tokenService *services.TokenService,
) {
	g := r.Group("/groups")
	g.Use(middleware.AuthMiddleware(tokenService))
	{
		g.POST("", controller.CreateGroup)
		g.GET("", controller.GetUserGroups)
		g.GET("/:id", controller.GetGroupByID)
		g.GET("/:id/members", controller.GetGroupMembers)
		g.GET("/:id/conversation", controller.GetGroupConversation)
		g.PUT("/:id", controller.UpdateGroup)
		g.DELETE("/:id/leave", controller.LeaveGroup)
	}
}
