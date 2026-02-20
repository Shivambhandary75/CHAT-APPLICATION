package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	MongoDBURI  string
	DBName      string
	JWTSecret   string
	JWTExpiry   time.Duration
}

var AppConfig *Config

// LoadConfig loads configuration from environment variables
func LoadConfig() (*Config, error) {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	// Parse JWT expiry duration
	jwtExpiry, err := time.ParseDuration(getEnv("JWT_EXPIRY", "24h"))
	if err != nil {
		log.Printf("Invalid JWT_EXPIRY format, using default: 24h")
		jwtExpiry = 24 * time.Hour
	}

	config := &Config{
		Port:       getEnv("PORT", "8080"),
		MongoDBURI: getEnv("MONGODB_URI", "mongodb://localhost:27017"),
		DBName:     getEnv("DB_NAME", "chatapp"),
		JWTSecret:  getEnv("JWT_SECRET", "default-secret-key"),
		JWTExpiry:  jwtExpiry,
	}

	AppConfig = config
	return config, nil
}

// getEnv retrieves an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
