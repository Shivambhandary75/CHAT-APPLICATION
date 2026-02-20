package main

import (
	"log"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/config"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/controllers"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/database"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/repositories"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/routes"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
)

func main() {
	cfg := config.Load()

	client := database.Connect(cfg.MongoURI)
	defer client.Disconnect(nil)

	messageRepo := repositories.NewMessageRepository(client, cfg.DBName)
	messageService := services.NewMessageService(messageRepo)
	messageController := controllers.NewMessageController(messageService)

	r := routes.SetupRouter()
	routes.RegisterMessageRoutes(r, messageController)

	log.Println("Server running on port", cfg.Port)
	r.Run(":" + cfg.Port)
}