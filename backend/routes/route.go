package routes

import (
	"net/http"

	"github.com/adk-saugat/mini-lms/handlers"
	"github.com/adk-saugat/mini-lms/middleware"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(server *gin.Engine){
	server.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	server.POST("/auth/register", handlers.RegisterUser)
	server.POST("/auth/login", handlers.LoginUser)

	authenticate := server.Group("/")
	authenticate.Use(middleware.Authenticate)

	authenticate.GET("/auth/me", handlers.GetUserProfile)
}