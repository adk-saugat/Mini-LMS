package handlers

import (
	"net/http"
	"strconv"

	"github.com/adk-saugat/mini-lms/models"
	"github.com/gin-gonic/gin"
)

func GetCourses(ctx *gin.Context) {
	page, err := strconv.ParseInt(ctx.DefaultQuery("page", "1"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Couldnot parse query values!", 
		})
		return
	}

	courses, err := models.FetchAllCourses(page)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Couldnot parse request data!", 
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"courses": courses,
		"page": page,
	})
}

func CreateCourse(ctx *gin.Context){
	var course models.Course
	instructorId := ctx.GetInt64("userId")

	err := ctx.ShouldBindJSON(&course)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Couldnot parse request data!", 
		})
		return
	}

	course.InstructorId = instructorId
	err = course.CreateCourse()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Couldnot create course!", 
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Course created successfully!",
	})
}