package app

import (
	"log"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/config"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/database"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/routes"
)

func Start() {
	cfg := config.Load()

	client := database.Connect(cfg.MongoURI)
	defer client.Disconnect(nil)

	r := routes.SetupRouter()

	// Register all feature modules
	RegisterModules(r, client, cfg.DBName)

	log.Println("Server running on port", cfg.Port)
	r.Run(":" + cfg.Port)
}