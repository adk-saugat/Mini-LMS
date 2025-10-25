package config

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5"
)

var connection *pgx.Conn
var dbCtx context.Context

func InitializeDatabase(){
	// get connection string
	connString := os.Getenv("NEON_POSTGRES_URI")
	if connString == ""{
		panic("unable to find database url")
	}

	// connect to database
	dbCtx = context.Background()

	var err error
	connection, err = pgx.Connect(dbCtx, connString)
	if err != nil {
		panic("unable to connect to database")
	}
	defer connection.Close(dbCtx)


	createTables()
}

func createTables(){
	query := `
		CREATE TABLE User (
			id SERIAL PRIMARY KEY
			firstName TEXT NOT NULL
			lastName TEXT NOT NULL
			email TEXT NOT NULL UNIQUE
			password TEXT NOT NULL
			role TEXT CHECK (role IN ('instructor', 'student')) NOT NULL
			createdAt TIMESTAMP DEFAULT NOW()
		)
	`

	_, err := connection.Exec(dbCtx, query)
	if err != nil {
		panic("couldnot create table")
	}
}