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