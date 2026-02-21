package app

import (
	"context"
	"log"
	"net/http"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/config"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/database"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/routes"
	"github.com/gin-gonic/gin"
)

func Start() {
	cfg := config.Load()

	client := database.Connect(cfg.MongoURI)
	defer client.Disconnect(context.Background())

	r := routes.SetupRouter(cfg.CorsOrigins)

	// Register all feature modules
	RegisterModules(r, client, cfg.DBName)

	// Serve static files from React build (optional - for production)
	r.Static("/assets", "../client/dist/assets")
	r.StaticFile("/vite.svg", "../client/dist/vite.svg")

	// Serve index.html for all non-API routes (SPA fallback)
	r.NoRoute(func(c *gin.Context) {
		if c.Request.URL.Path[:4] != "/api" && c.Request.URL.Path[:5] != "/auth" && c.Request.URL.Path[:4] != "/ws/" {
			c.File("../client/dist/index.html")
		} else {
			c.JSON(http.StatusNotFound, gin.H{"error": "route not found"})
		}
	})

	log.Println("Server running on port", cfg.Port)
	r.Run(":" + cfg.Port)
}
