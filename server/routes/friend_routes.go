package routes

import (
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/controllers"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/middleware"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/gin-gonic/gin"
)

func RegisterFriendRoutes(r *gin.Engine, controller *controllers.FriendController, tokenService *services.TokenService) {
	friends := r.Group("/api/friends")
	friends.Use(middleware.AuthMiddleware(tokenService))
	{
		friends.POST("/request", controller.SendRequest)
		friends.POST("/accept/:id", controller.AcceptRequest)
		friends.POST("/reject/:id", controller.RejectRequest)
		friends.DELETE("/cancel/:id", controller.CancelRequest)
		friends.GET("/requests/received", controller.GetReceivedRequests)
		friends.GET("/requests/sent", controller.GetSentRequests)
		friends.GET("", controller.GetFriends)
		friends.GET("/search", controller.SearchUsers)
	}
}
