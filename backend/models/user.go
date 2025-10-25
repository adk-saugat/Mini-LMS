package models

import (
	"fmt"
	"time"

	"github.com/adk-saugat/mini-lms/config"
)

type User struct{
	ID 			int64		`json:"id"`
	FirstName 	string		`json:"firstName"`
	LastName  	string		`json:"lastName"`
	Email  		string		`json:"email"`
	Password 	string		`json:"-"` // Don't include password in JSON responses
	Role 		string		`json:"role"`
	CreatedAt 	time.Time	`json:"createdAt"`
}

func (user *User) Register() error{
	query := `
		INSERT INTO "User" ("firstName", "lastName", email, password, role) 
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id;
	`

	err := config.Connection.QueryRow(config.DbCtx, query, user.FirstName, user.LastName, user.Email, user.Password, user.Role).Scan(&user.ID)
	if err != nil {
		fmt.Printf("Database error: %v\n", err)
		return err
	}

	return nil
}