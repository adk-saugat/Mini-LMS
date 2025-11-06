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