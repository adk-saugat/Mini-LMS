package handlers

import (
	"net/http"
	"strconv"

	"github.com/adk-saugat/mini-lms/models"
	"github.com/gin-gonic/gin"
)

func DeleteCourse(ctx *gin.Context) {
	courseIdStr := ctx.Param("courseId")
	courseId, err := strconv.ParseInt(courseIdStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not parse parameters!",
		})
		return
	}

	instructorId := ctx.GetInt64("userId")

	course, err := models.GetCourseById(courseId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could fetch course!",
		})
		return
	}

	if course.InstructorId != instructorId {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": "Not authorized to delete course!",
		})
		return
	}


	err = models.DeleteCourse(courseId, instructorId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not delete course!",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Course deleted successfully!",
	})
}

func FetchCourse(ctx *gin.Context){
	courseId, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not parse parameters!",
		})
		return
	}

	course, err := models.GetCourseById(courseId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could fetch course!",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"course": course,
	})
}

func FetchAllCourses(ctx *gin.Context) {
	page, err := strconv.ParseInt(ctx.DefaultQuery("page", "1"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Couldnot parse query values!", 
		})
		return
	}

	courses, err := models.GetAllCourses(page)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Couldnot fetch courses!", 
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