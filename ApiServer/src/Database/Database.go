package Database

import (
	"database/sql"
	"fmt"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
	"log"
	"os"
)

var DB *bun.DB

func New() (*bun.DB, error) {
	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")
	database := os.Getenv("POSTGRES_DB")
	addr := os.Getenv("POSTGRES_ADDR")

	dsn := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable", user, password, addr, database)
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(dsn)))
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
