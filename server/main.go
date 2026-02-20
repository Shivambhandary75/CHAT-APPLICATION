package main

import (
	"chat-app/server/config"
	"chat-app/server/handlers"
	"chat-app/server/middleware"
	"chat-app/server/services"
	"chat-app/server/storage"
	"chat-app/server/utils"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/gorilla/mux"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	log.Println("Configuration loaded successfully")

	// Connect to MongoDB
	db, err := storage.ConnectDB(cfg.MongoDBURI, cfg.DBName)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Disconnect()

	// Initialize repositories
	userRepo := storage.NewUserRepository(db)

	// Initialize services
	userService := services.NewUserService(userRepo)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(userService)

	// Setup router
	router := mux.NewRouter()

	// Apply middleware
	router.Use(middleware.CORS)
	router.Use(utils.LoggingMiddleware)

	// Public routes
	router.HandleFunc("/api/auth/signup", authHandler.Signup).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/auth/login", authHandler.Login).Methods("POST", "OPTIONS")

	// Protected routes
	router.HandleFunc("/api/auth/profile", authHandler.ValidateToken(authHandler.GetProfile)).Methods("GET", "OPTIONS")

	// Health check
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status": "healthy"}`))
	}).Methods("GET")

	// Start server
	serverAddr := ":" + cfg.Port
	log.Printf("Server starting on port %s", cfg.Port)
	log.Printf("API endpoints:")
	log.Printf("  POST   /api/auth/signup")
	log.Printf("  POST   /api/auth/login")
	log.Printf("  GET    /api/auth/profile (protected)")
	log.Printf("  GET    /health")

	// Graceful shutdown
	go func() {
		if err := http.ListenAndServe(serverAddr, router); err != nil {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Server shutting down gracefully...")
}
