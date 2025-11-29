package handlers

import (
	"net/http"
	"strconv"

	"github.com/adk-saugat/mini-lms/models"
	"github.com/gin-gonic/gin"
)

func EnrollInCourse(ctx *gin.Context) {
	courseIdStr := ctx.Param("courseId")
	courseId, err := strconv.ParseInt(courseIdStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not parse courseId!",
		})
		return
	}

	studentId := ctx.GetInt64("userId")

	// Check if course exists
	course, err := models.GetCourseById(courseId)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "Course not found!",
		})
		return
	}

	// Prevent instructor from enrolling in their own course
	if course.InstructorId == studentId {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Cannot enroll in your own course!",
		})
		return
	}

	// Check if already enrolled
	alreadyEnrolled, err := models.CheckIfEnrolled(studentId, courseId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not check enrollment status!",
		})
		return
	}

	if alreadyEnrolled {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Already enrolled in this course!",
		})
		return
	}

	// Create enrollment
	var enrollment models.Enrollment
	enrollment.StudentId = studentId
	enrollment.CourseId = courseId

	err = enrollment.Create()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not enroll in course!",
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Successfully enrolled in course!",
		"enrollment": enrollment,
	})
}

func CheckEnrollment(ctx *gin.Context) {
	courseIdStr := ctx.Param("courseId")
	courseId, err := strconv.ParseInt(courseIdStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not parse courseId!",
		})
		return
	}

	studentId := ctx.GetInt64("userId")

	enrolled, err := models.CheckIfEnrolled(studentId, courseId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not check enrollment status!",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"enrolled": enrolled,
	})
}

func GetStudentEnrollments(ctx *gin.Context) {
	studentId := ctx.GetInt64("userId")

	enrollments, err := models.GetStudentEnrollments(studentId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not fetch enrollments!",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"enrollments": enrollments,
	})
}

func GetStudentEnrolledCourses(ctx *gin.Context) {
	studentId := ctx.GetInt64("userId")

	enrolledCourses, err := models.GetStudentEnrolledCourses(studentId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not fetch enrolled courses!",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"courses": enrolledCourses,
	})
}

func GetCourseEnrolledStudentsCount(ctx *gin.Context) {
	courseIdStr := ctx.Param("courseId")
	courseId, err := strconv.ParseInt(courseIdStr, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Could not parse courseId!",
		})
		return
	}

	instructorId := ctx.GetInt64("userId")

	// Verify the course belongs to the instructor
	course, err := models.GetCourseById(courseId)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"error": "Course not found!",
		})
		return
	}

	if course.InstructorId != instructorId {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": "Not authorized to view students for this course!",
		})
		return
	}

	count, err := models.GetCourseEnrolledStudentsCount(courseId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not fetch enrolled students count!",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"count": count,
	})
}

