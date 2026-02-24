package config

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port          string
	MongoURI      string
	DBName        string
	CorsOrigins   []string
	CloudinaryURL string
}

func Load() Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	origins := strings.Split(os.Getenv("CORS_ORIGINS"), ",")

	return Config{
		Port:          os.Getenv("PORT"),
		MongoURI:      os.Getenv("MONGO_URI"),
		DBName:        os.Getenv("DB_NAME"),
		CorsOrigins:   origins,
		CloudinaryURL: os.Getenv("CLOUDINARY_URL"),
	}
}
