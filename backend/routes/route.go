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

	// auth routes
	server.POST("/auth/register", handlers.RegisterUser)
	server.POST("/auth/login", handlers.LoginUser)

	// general routes to everyone
	server.GET("/courses", handlers.FetchAllCourses)
	server.GET("/courses/:id", handlers.FetchCourse)

	authenticate := server.Group("/")
	authenticate.Use(middleware.Authenticate)

	authenticate.GET("/auth/me", handlers.GetUserProfile)

	// instructor-only course routes
	instructorRoutes := server.Group("/courses")
	instructorRoutes.Use(middleware.Authenticate)
	instructorRoutes.Use(middleware.CheckInstructor)

	instructorRoutes.POST("", handlers.CreateCourse)
	instructorRoutes.PUT("/:courseId", handlers.UpdateCourse)
	instructorRoutes.DELETE("/:courseId", handlers.DeleteCourse)

	instructorRoutes.POST("/:courseId/lessons", handlers.CreateLesson)
}