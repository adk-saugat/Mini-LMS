package main

import (
	"os"

	"github.com/adk-saugat/mini-lms/config"
	"github.com/adk-saugat/mini-lms/middleware"
	"github.com/adk-saugat/mini-lms/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main(){
	// load environment variables
	err := godotenv.Load()
	if err != nil {
		panic("couldnot load environment variables")
	}

	//init database
	config.InitializeDatabase()

	// init gin
	server := gin.Default()

	// CORS middleware
	server.Use(cors.New(middleware.SetupCORS()))

	// routes
	routes.RegisterRoutes(server)

	// fetch port and run server
	PORT := os.Getenv("PORT")
	if PORT == ""{
		PORT = "8080"
	}
	server.Run(":" + PORT)
}