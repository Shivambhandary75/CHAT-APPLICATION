package routes

import (
	"github.com/gin-gonic/gin"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/controllers"
)

func RegisterStatsRoutes(r *gin.Engine, statsController *controllers.StatsController) {
	statsGroup := r.Group("/api/stats")
	{
		statsGroup.GET("/stream", statsController.StreamStats)
	}
}
