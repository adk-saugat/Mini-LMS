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

func FetchAllCourses(pageNumber int64) ([]Course, error){
	offset := (pageNumber - 1) * 2
	query := `
		SELECT * FROM Course
		ORDER BY id
		LIMIT 2
		OFFSET $1
	`

	rows, err := config.Connection.Query(config.DbCtx, query, offset)
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