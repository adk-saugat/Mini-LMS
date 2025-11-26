package models

import (
	"time"

	"github.com/adk-saugat/mini-lms/config"
)

type Lesson struct {
	Id int64 `json:"id"`
	CourseId int64 `json:"courseId"`
	Title string `json:"title"`
	Overview string `json:"overview"`
	Content string `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
}

func GetCourseLessons(courseId int64) ([]Lesson, error){
	query := `
		SELECT id, "courseId", title, overview, content, "createdAt" FROM Lesson
		WHERE "courseId" = $1
	`

	rows, err := config.Pool.Query(config.DbCtx, query, courseId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var lessons []Lesson
	for rows.Next() {
		var lesson Lesson
		err := rows.Scan(
			&lesson.Id,
			&lesson.CourseId,
			&lesson.Title,
			&lesson.Overview,
			&lesson.Content,
			&lesson.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		lessons = append(lessons, lesson)
	}
	
	return lessons, rows.Err()
}

func GetLessonById(lessonId int64) (*Lesson, error) {
	query := `
		SELECT id, "courseId", title, overview, content, "createdAt"
		FROM Lesson
		WHERE id = $1
	`

	row := config.Pool.QueryRow(config.DbCtx, query, lessonId)

	var lesson Lesson
	err := row.Scan(
		&lesson.Id,
		&lesson.CourseId,
		&lesson.Title,
		&lesson.Overview,
		&lesson.Content,
		&lesson.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &lesson, nil
}

func (lesson *Lesson) Create() error{
	query := `	
		INSERT INTO Lesson ("courseId", title, overview, content)
		VALUES ($1, $2, $3, $4)
	`

	_, err := config.Pool.Exec(config.DbCtx, query,
		lesson.CourseId,
		lesson.Title,
		lesson.Overview,
		lesson.Content,
	)
	if err != nil {
		return err
	}

	return nil
}

func (lesson *Lesson) Update() error {
	query := `
		UPDATE Lesson
		SET title = $1, overview = $2, content = $3
		WHERE id = $4
	`

	_, err := config.Pool.Exec(config.DbCtx, query,
		lesson.Title,
		lesson.Overview,
		lesson.Content,
		lesson.Id,
	)
	if err != nil {
		return err
	}

	return nil
}

func DeleteLesson(lessonId int64) error {
	query := `
		DELETE FROM Lesson
		WHERE id = $1
	`

	_, err := config.Pool.Exec(config.DbCtx, query, lessonId)
	if err != nil {
		return err
	}

	return nil
}