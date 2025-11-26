package config

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool
var DbCtx context.Context

func InitializeDatabase(){
	// get connection string
	connString := os.Getenv("NEON_POSTGRES_URI")
	if connString == ""{
		panic("unable to find database url")
	}

	// connect to database using connection pool
	DbCtx = context.Background()

	var err error
	Pool, err = pgxpool.New(DbCtx, connString)
	if err != nil {
		panic("unable to connect to database: " + err.Error())
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

	_, err := Pool.Exec(DbCtx, query)
	if err != nil {
		panic("could not create table")
	}

	query = `
		CREATE TABLE IF NOT EXISTS Course (
			id SERIAL PRIMARY KEY,
			"instructorId" INTEGER NOT NULL REFERENCES "User"(id),
			title TEXT NOT NULL,
			description VARCHAR(255),
			category TEXT,
			"createdAt" TIMESTAMP DEFAULT NOW()
		)
	`

	_, err = Pool.Exec(DbCtx, query)
	if err != nil {
		panic("could not create table")
	}

	query = `
		CREATE TABLE IF NOT EXISTS Lesson (
			id SERIAL PRIMARY KEY,
			"courseId" INTEGER NOT NULL REFERENCES Course(id),
			title VARCHAR(100) NOT NULL,
			overview TEXT,
			content TEXT,
			"createdAt" TIMESTAMP DEFAULT NOW()
		)
	`

	_, err = Pool.Exec(DbCtx, query)
	if err != nil {
		panic("could not create table")
	}

	query = `
		CREATE TABLE IF NOT EXISTS Enrollment (
			id SERIAL PRIMARY KEY,
			"studentId" INTEGER NOT NULL REFERENCES "User"(id),
			"courseId" INTEGER NOT NULL REFERENCES Course(id),
			"enrolledAt" TIMESTAMP DEFAULT NOW(),
			UNIQUE ("studentId", "courseId")
		)
	`

	_, err = Pool.Exec(DbCtx, query)
	if err != nil {
		panic("could not create table")
	}
}