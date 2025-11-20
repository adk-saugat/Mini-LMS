package handlers

import (
	"net/http"
	"strconv"

	"github.com/adk-saugat/mini-lms/models"
	"github.com/gin-gonic/gin"
)

func FetchCourseLessons(ctx *gin.Context){
	courseIdStr := ctx.Param("courseId")
	courseId, err := strconv.ParseInt(courseIdStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid courseId"})
		return
	} 

	_, err = models.GetCourseById(courseId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Couldnot find course!"})
		return
	}

	lessons, err := models.GetCourseLessons(courseId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Couldnot fetch lessons data!",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"lessons": lessons,
	})

}

func CreateLesson(ctx *gin.Context) {
	courseIdStr := ctx.Param("courseId")
	courseId, err := strconv.ParseInt(courseIdStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid courseId"})
		return
	} 

	_, err = models.GetCourseById(courseId)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Couldnot find course!"})
		return
	}

	var lesson models.Lesson
	err = ctx.ShouldBindJSON(&lesson)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Couldnot parse request data!"})
		return
	}

	lesson.CourseId = courseId
	err = lesson.Create()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldnot create lesson!"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "Lesson created successfully!"})
}
