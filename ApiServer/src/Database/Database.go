package Database

import (
	"database/sql"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
	"log"
	"os"
)

var DB *bun.DB

func New() (*bun.DB, error) {
	dsn := os.Getenv("POSTGRES_DSN")
	dbname := os.Getenv("POSTGRES_DB")
	connector := pgdriver.NewConnector(pgdriver.WithDSN(dsn), pgdriver.WithDatabase(dbname))
	sqldb := sql.OpenDB(connector)
	DB := bun.NewDB(sqldb, pgdialect.New())
	DB.AddQueryHook(bundebug.NewQueryHook())
	//DB.AddQueryHook(bundebug.NewQueryHook(bundebug.WithVerbose(true)))

	log.Println("Database connected")

	DB.AddQueryHook(bundebug.NewQueryHook(
		bundebug.WithVerbose(true),
		bundebug.FromEnv("BUNDEBUG"),
	))

	return DB, nil
}
