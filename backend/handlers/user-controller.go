package handlers

import (
	"net/http"

	"github.com/adk-saugat/mini-lms/models"
	"github.com/gin-gonic/gin"
)

func GetAllCourseCreated(ctx *gin.Context){
	userId := ctx.GetInt64("userId")

	var course []models.Course
	var err error

	course, err = models.GetCreatedCourse(userId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Couldnot get course data!",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"course": course,
	})
}
