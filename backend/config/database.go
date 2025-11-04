package config

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5"
)

var Connection *pgx.Conn
var DbCtx context.Context

func InitializeDatabase(){
	// get connection string
	connString := os.Getenv("NEON_POSTGRES_URI")
	if connString == ""{
		panic("unable to find database url")
	}

	// connect to database
	DbCtx = context.Background()

	var err error
	Connection, err = pgx.Connect(DbCtx, connString)
	if err != nil {
		panic("unable to connect to database")
	}


	createTables()
}

func createTables(){
	query := `
		CREATE TABLE IF NOT EXISTS "User" (
			id SERIAL PRIMARY KEY,
			"firstName" TEXT NOT NULL,
			"lastName" TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			password TEXT NOT NULL,
			role TEXT CHECK (role IN ('instructor', 'student')) NOT NULL,
			"createdAt" TIMESTAMP DEFAULT NOW()
		)
	`

	_, err := Connection.Exec(DbCtx, query)
	if err != nil {
		panic("could not create table")
	}

	query = `
		CREATE TABLE IF NOT EXISTS Course (
			id SERIAL PRIMARY KEY,
			"instructorId" INTEGER NOT NULL,
			title TEXT NOT NULL,
			description VARCHAR(255) NOT NULL,
			category TEXT NOT NULL,
			"createdAt" TIMESTAMP DEFAULT NOW()
		)
	`

	_, err = Connection.Exec(DbCtx, query)
	if err != nil {
		panic("could not create table")
	}
}