package handlers

import (
	"net/http"
	"strconv"

	"github.com/adk-saugat/mini-lms/models"
	"github.com/gin-gonic/gin"
)

// func EditLesson(ctx *gin.Context){
// 	courseIdStr := ctx.Param("courseId")
// 	courseId, err := strconv.ParseInt(courseIdStr, 10, 64)
// 	if err != nil {
// 		ctx.JSON(http.StatusBadRequest, gin.H{
// 			"error": "Could not parse parameters!",
// 		})
// 		return
// 	}

// 	lessonIdStr := ctx.Param("lessonId")
// 	lessonId, err := strconv.ParseInt(lessonIdStr, 10, 64)
// 	if err != nil {
// 		ctx.JSON(http.StatusBadRequest, gin.H{
// 			"error": "Could not parse parameters!",
// 		})
// 		return
// 	}

// 	instructorId := ctx.GetInt64("userId")

// 	course, err := models.GetCourseById(courseId)
// 	if err != nil {
// 		ctx.JSON(http.StatusInternalServerError, gin.H{
// 			"error": "Could fetch course!",
// 		})
// 		return
// 	}

// 	if course.InstructorId != instructorId {
// 		ctx.JSON(http.StatusUnauthorized, gin.H{
// 			"error": "Not authorized to update lesson!",
// 		})
// 		return
// 	}

// 	var updatedLesson models.Lesson
// 	err = ctx.ShouldBindJSON(&updatedLesson)
// 	if err != nil {
// 		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Couldnot parse request data!"})
// 		return
// 	}

// 	// Merge: use new values if provided, otherwise keep existing values
// 	if updatedCourse.Title != "" {
// 		course.Title = updatedCourse.Title
// 	}
// 	if updatedCourse.Description != "" {
// 		course.Description = updatedCourse.Description
// 	}
// 	if updatedCourse.Category != "" {
// 		course.Category = updatedCourse.Category
// 	}

// 	err = course.Update()
// 	if err != nil {
// 		ctx.JSON(http.StatusInternalServerError, gin.H{
// 			"error": "Could not update course!",
// 		})
// 		return
// 	}

// 	ctx.JSON(http.StatusOK, gin.H{
// 		"message": "Course updated successfully!",
// 	})
// }

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

func EditLesson(ctx *gin.Context) {
	courseIdStr := ctx.Param("courseId")
	courseId, err := strconv.ParseInt(courseIdStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not parse courseId!",
		})
		return
	}

	lessonIdStr := ctx.Param("lessonId")
	lessonId, err := strconv.ParseInt(lessonIdStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not parse lessonId!",
		})
		return
	}

	instructorId := ctx.GetInt64("userId")

	course, err := models.GetCourseById(courseId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not fetch course!",
		})
		return
	}

	if course.InstructorId != instructorId {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": "Not authorized to update lesson!",
		})
		return
	}

	lesson, err := models.GetLessonById(lessonId)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "Could not find lesson!",
		})
		return
	}

	if lesson.CourseId != courseId {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Lesson does not belong to this course!",
		})
		return
	}

	var updatedLesson models.Lesson
	err = ctx.ShouldBindJSON(&updatedLesson)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Could not parse request data!"})
		return
	}

	// Merge: use new values if provided, otherwise keep existing values
	if updatedLesson.Title != "" {
		lesson.Title = updatedLesson.Title
	}
	if updatedLesson.Overview != "" {
		lesson.Overview = updatedLesson.Overview
	}
	if updatedLesson.Content != "" {
		lesson.Content = updatedLesson.Content
	}

	err = lesson.Update()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not update lesson!",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Lesson updated successfully!",
	})
}

func DeleteLesson(ctx *gin.Context) {
	courseIdStr := ctx.Param("courseId")
	courseId, err := strconv.ParseInt(courseIdStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not parse courseId!",
		})
		return
	}

	lessonIdStr := ctx.Param("lessonId")
	lessonId, err := strconv.ParseInt(lessonIdStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not parse lessonId!",
		})
		return
	}

	instructorId := ctx.GetInt64("userId")

	course, err := models.GetCourseById(courseId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not fetch course!",
		})
		return
	}

	if course.InstructorId != instructorId {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": "Not authorized to delete lesson!",
		})
		return
	}

	lesson, err := models.GetLessonById(lessonId)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "Could not find lesson!",
		})
		return
	}

	if lesson.CourseId != courseId {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Lesson does not belong to this course!",
		})
		return
	}

	err = models.DeleteLesson(lessonId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not delete lesson!",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Lesson deleted successfully!",
	})
}
