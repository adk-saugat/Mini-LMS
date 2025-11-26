package models

import (
	"time"

	"github.com/adk-saugat/mini-lms/config"
)

type Enrollment struct {
	Id        int64     `json:"id"`
	StudentId int64     `json:"studentId"`
	CourseId  int64     `json:"courseId"`
	EnrolledAt time.Time `json:"enrolledAt"`
}

func CheckIfEnrolled(studentId, courseId int64) (bool, error) {
	query := `
		SELECT EXISTS(
			SELECT 1 FROM Enrollment
			WHERE "studentId" = $1 AND "courseId" = $2
		)
	`

	var exists bool
	err := config.Pool.QueryRow(config.DbCtx, query, studentId, courseId).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func (enrollment *Enrollment) Create() error {
	query := `
		INSERT INTO Enrollment ("studentId", "courseId")
		VALUES ($1, $2)
		RETURNING id, "enrolledAt"
	`

	err := config.Pool.QueryRow(
		config.DbCtx,
		query,
		enrollment.StudentId,
		enrollment.CourseId,
	).Scan(&enrollment.Id, &enrollment.EnrolledAt)
	
	if err != nil {
		return err
	}

	return nil
}

func GetStudentEnrollments(studentId int64) ([]Enrollment, error) {
	query := `
		SELECT id, "studentId", "courseId", "enrolledAt"
		FROM Enrollment
		WHERE "studentId" = $1
		ORDER BY "enrolledAt" DESC
	`

	rows, err := config.Pool.Query(config.DbCtx, query, studentId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var enrollments []Enrollment
	for rows.Next() {
		var enrollment Enrollment
		err := rows.Scan(
			&enrollment.Id,
			&enrollment.StudentId,
			&enrollment.CourseId,
			&enrollment.EnrolledAt,
		)
		if err != nil {
			return nil, err
		}
		enrollments = append(enrollments, enrollment)
	}

	return enrollments, rows.Err()
}

type EnrolledCourse struct {
	Course      Course      `json:"course"`
	EnrolledAt  time.Time   `json:"enrolledAt"`
}

func GetStudentEnrolledCourses(studentId int64) ([]EnrolledCourse, error) {
	query := `
		SELECT 
			c.id,
			c."instructorId",
			c.title,
			c.description,
			c.category,
			c."createdAt",
			e."enrolledAt"
		FROM Enrollment e
		INNER JOIN Course c ON e."courseId" = c.id
		WHERE e."studentId" = $1
		ORDER BY e."enrolledAt" DESC
	`

	rows, err := config.Pool.Query(config.DbCtx, query, studentId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var enrolledCourses []EnrolledCourse
	for rows.Next() {
		var enrolledCourse EnrolledCourse
		err := rows.Scan(
			&enrolledCourse.Course.ID,
			&enrolledCourse.Course.InstructorId,
			&enrolledCourse.Course.Title,
			&enrolledCourse.Course.Description,
			&enrolledCourse.Course.Category,
			&enrolledCourse.Course.CreatedAt,
			&enrolledCourse.EnrolledAt,
		)
		if err != nil {
			return nil, err
		}
		enrolledCourses = append(enrolledCourses, enrolledCourse)
	}

	return enrolledCourses, rows.Err()
}

func GetTotalStudentsEnrolled(instructorId int64) (int, error) {
	query := `
		SELECT COUNT(DISTINCT e."studentId")
		FROM Enrollment e
		INNER JOIN Course c ON e."courseId" = c.id
		WHERE c."instructorId" = $1
	`

	var totalStudents int
	err := config.Pool.QueryRow(config.DbCtx, query, instructorId).Scan(&totalStudents)
	if err != nil {
		return 0, err
	}

	return totalStudents, nil
}

