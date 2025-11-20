package models

import (
	"time"

	"github.com/adk-saugat/mini-lms/config"
)

type Lesson struct {
	Id int64 `json:"id"`
	CourseId int64 `json:"courseId"`
	Title string `json:"title"`
	Content string `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
}

func GetCourseLessons(courseId int64) ([]Lesson, error){
	query := `
		SELECT * FROM Lesson
		WHERE "courseId" = $1
	`

	rows, err := config.Connection.Query(config.DbCtx, query, courseId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var lessons []Lesson
	for rows.Next() {
		var lesson Lesson
		err := rows.Scan(&lesson.Id, &lesson.CourseId, &lesson.Title, &lesson.Content, &lesson.CreatedAt)
		if err != nil {
			return nil, err
		}

		lessons = append(lessons, lesson)
	}
	return lessons, nil
}

func (lesson *Lesson) Create() error{
	query := `	
		INSERT INTO Lesson ("courseId", title, content)
		VALUES ($1, $2, $3)
	`

	_, err := config.Connection.Exec(config.DbCtx, query, lesson.CourseId, lesson.Title, lesson.Content)
	if err != nil {
		return err
	}

	return nil
}