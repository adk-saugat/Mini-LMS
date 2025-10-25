package models

import "time"

type User struct{
	ID 			int64		`json:"id"`
	FirstName 	string		`json:"firstName"`
	LastName  	string		`json:"lastName"`
	Email  		string		`json:"email"`
	Password 	string		
	Role 		string		`json:"role"`
	CreatedAt 	time.Time	`json:"createdAt"`
}