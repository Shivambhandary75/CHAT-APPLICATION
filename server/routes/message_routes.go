package routes

import (
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/controllers"
	"github.com/gin-gonic/gin"
)

func RegisterMessageRoutes(r *gin.Engine, controller *controllers.MessageController) {
	r.POST("/messages", controller.SendMessage)
	r.GET("/messages/:room_id", controller.GetMessages)
}