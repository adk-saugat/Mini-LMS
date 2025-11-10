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
		RETURNING id, "createdAt"
	`

	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return errors.New("couldnot hash password")
	}

	err = config.Connection.QueryRow(config.DbCtx, query, user.FirstName, user.LastName, user.Email, hashedPassword, user.Role).Scan(&user.ID, &user.CreatedAt)
	if err != nil {
		return err
	}

	return nil
}

func (user *User) ValidateCredential() error{
	query := `
		SELECT id, password, role
		FROM "User"
		WHERE email = $1
	`

	row := config.Connection.QueryRow(config.DbCtx, query, user.Email)

	var retrievedPassword string
	err := row.Scan(&user.ID, &retrievedPassword, &user.Role)
	if err != nil {
		return err
	}

	isPasswordValid := utils.CheckPasswordHash(user.Password, retrievedPassword)
	if !isPasswordValid {
		return errors.New("invalid credentials")
	}

	return nil
}

func GetUserById(userId int64) (*User, error){
	query := `
		SELECT id, "firstName", "lastName", email, role, "createdAt"
		FROM "User"
		WHERE id = $1;
	`

	row := config.Connection.QueryRow(config.DbCtx, query, userId)
	
	var user User
	err := row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.Role, &user.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &user, nil
}