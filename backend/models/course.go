package models

import (
	"time"

	"github.com/adk-saugat/mini-lms/config"
)

type Course struct{
	ID 				int64 		`json:"id"`
	InstructorId 	int64 		`json:"instructorId"`
	Title		 	string 		`json:"title" binding:"required"`
	Description	 	string 		`json:"description"`
	Category 		string		`json:"category"`
	CreatedAt	 	time.Time 	`json:"createdAt"`
}


func GetCreatedCourse(instructorId int64) ([]Course, error){
	query := `
		SELECT * FROM Course
		WHERE "instructorId" = $1
	`

	rows, err := config.Connection.Query(config.DbCtx, query, instructorId)
	if err != nil {
		return nil, err
	}

	var courses []Course
	for rows.Next() {
		var course Course
		err = rows.Scan(&course.ID, &course.InstructorId, &course.Title, &course.Description, &course.Category, &course.CreatedAt)
		if err != nil {
			return nil, err
		}
		courses = append(courses, course)
	}      

	return courses, nil

}

func (course *Course) Update() error{
	query := `
		UPDATE Course
		SET title = $1, description = $2, category = $3
		WHERE id = $4
	`

	_, err := config.Connection.Exec(config.DbCtx, query, course.Title, course.Description, course.Category, course.ID)
	if err != nil {
		return err
	}

	return nil
}

func DeleteCourse(courseId, instructorId int64) (error){
	query := `
		DELETE FROM Course
		WHERE id = $1 AND "instructorId" = $2
	`

	_, err := config.Connection.Exec(config.DbCtx, query, courseId, instructorId)
	if err != nil {
		return err
	}
	return nil
}

func GetCourseById(courseId int64) (*Course, error){
	query := `
		SELECT * FROM Course
		WHERE id = $1
	`

	row := config.Connection.QueryRow(config.DbCtx, query, courseId)

	var course Course
	err := row.Scan(&course.ID, &course.InstructorId, &course.Title, &course.Description, &course.Category, &course.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &course, nil
}

func GetAllCourses(pageNumber int64) ([]Course, error){
	limit := int64(6)
	offset := (pageNumber - 1) * limit
	query := `
		SELECT * FROM Course
		ORDER BY id
		LIMIT $1
		OFFSET $2
	`

	rows, err := config.Connection.Query(config.DbCtx, query, limit, offset)
	if err != nil {
		return nil, err
	}
	
	var courses []Course
	for rows.Next() {
		var course Course
		err = rows.Scan(&course.ID, &course.InstructorId, &course.Title, &course.Description, &course.Category, &course.CreatedAt)
		if err != nil {
			return nil, err
		}
		courses = append(courses, course)
	}      

	return courses, nil
}

func (course *Course) CreateCourse() error{
	query := `
		INSERT INTO Course ("instructorId", title, description, category)
		VALUES ($1, $2, $3, $4)
	`

	_, err := config.Connection.Exec(config.DbCtx, query, course.InstructorId, course.Title, course.Description, course.Category)
	if err != nil {
		return err
	}

	return nil
}