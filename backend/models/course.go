package models

import "time"

type Course struct{
	ID 				int64 		`json:"id"`
	InstructorId 	int64 		`json:"instructorId"`
	Title		 	string 		`json:"title"`
	Description	 	string 		`json:"description"`
	CreatedAt	 	time.Time 	`json:"createdAt"`
}