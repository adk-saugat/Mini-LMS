package middleware

import (
	"os"

	"github.com/gin-contrib/cors"
)

func SetupCORS() cors.Config {
	origins := []string{"http://localhost:5173"}
	if frontendURL := os.Getenv("FRONTEND_URL"); frontendURL != "" {
		origins = append(origins, frontendURL)
	}
	
	return cors.Config{
		AllowOrigins:     origins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}
}

