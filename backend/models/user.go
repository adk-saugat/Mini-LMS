package models

import (
	"errors"
	"time"

	"github.com/adk-saugat/mini-lms/config"
	"github.com/adk-saugat/mini-lms/utils"
)

type User struct{
	ID 			int64		`json:"id"`
	FirstName 	string		`json:"firstName"`
	LastName  	string		`json:"lastName"`
	Email  		string		`json:"email"`
	Password 	string		
	Role 		string		`json:"role"`
	CreatedAt 	time.Time	`json:"createdAt"`
}

func (user *User) Register() error{
	query := `
		INSERT INTO "User" ("firstName", "lastName", email, password, role) 
		VALUES ($1, $2, $3, $4, $5)
	`

	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return errors.New("couldnot hash password")
	}

	_, err = config.Connection.Exec(config.DbCtx, query, user.FirstName, user.LastName, user.Email, hashedPassword, user.Role)
	if err != nil {
		return err
	}

	return nil
}

func (user *User) ValidateCredential() error{
	query := `
		SELECT id, password
		FROM "User"
		WHERE email = $1
	`

	row := config.Connection.QueryRow(config.DbCtx, query, user.Email)

	var retrievedPassword string
	err := row.Scan(&user.ID, &retrievedPassword)
	if err != nil {
		return err
	}

	isPasswordValid := utils.CheckPasswordHash(user.Password, retrievedPassword)
	if !isPasswordValid {
		return errors.New("invalid credentials")
	}

	return nil
}