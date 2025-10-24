package config

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5"
)

func InitializeDatabase(){
	// get connection string
	connString := os.Getenv("NEON_POSTGRES_URI")
	if connString == ""{
		panic("unable to find database url")
	}

	// connect to database
	dbCtx := context.Background()

	connection, err := pgx.Connect(dbCtx, connString)
	if err != nil {
		panic("unable to connect to database")
	}
	defer connection.Close(dbCtx)


	createTables()
}

func createTables(){
	
}