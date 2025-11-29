package routes

import (
	"net/http"

	"github.com/adk-saugat/mini-lms/handlers"
	"github.com/adk-saugat/mini-lms/middleware"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(server *gin.Engine) {
	// Public routes
	server.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	server.POST("/auth/register", handlers.RegisterUser)
	server.POST("/auth/login", handlers.LoginUser)

	server.GET("/courses", handlers.FetchAllCourses)
	server.GET("/courses/:courseId", handlers.FetchCourse)
	server.GET("/courses/:courseId/lessons", handlers.FetchCourseLessons)

	// Authenticated routes
	authenticated := server.Group("/")
	authenticated.Use(middleware.Authenticate)

	authenticated.GET("/auth/me", handlers.GetUserProfile)

	// Enrollment routes - for students
	authenticated.POST("/courses/:courseId/enroll", handlers.EnrollInCourse)
	authenticated.GET("/courses/:courseId/enroll", handlers.CheckEnrollment)
	authenticated.GET("/enrollments", handlers.GetStudentEnrollments)
	authenticated.GET("/enrollments/courses", handlers.GetStudentEnrolledCourses)

	// Instructor-only routes
	instructorRoutes := server.Group("/courses")
	instructorRoutes.Use(middleware.Authenticate)
	instructorRoutes.Use(middleware.CheckInstructor)

	instructorRoutes.POST("", handlers.CreateCourse)
	instructorRoutes.PUT("/:courseId", handlers.UpdateCourse)
	instructorRoutes.DELETE("/:courseId", handlers.DeleteCourse)
	instructorRoutes.GET("/created", handlers.GetAllCourseCreated)
	instructorRoutes.GET("/students/total", handlers.GetTotalStudentsEnrolled)
	instructorRoutes.GET("/:courseId/students/count", handlers.GetCourseEnrolledStudentsCount)

	// Lesson routes - nested under courses (only POST requires instructor)
	instructorRoutes.POST("/:courseId/lessons", handlers.CreateLesson)
	instructorRoutes.PUT("/:courseId/lessons/:lessonId", handlers.EditLesson)
	instructorRoutes.DELETE("/:courseId/lessons/:lessonId", handlers.DeleteLesson)
}