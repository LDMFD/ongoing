package Database

import (
	"context"
	"database/sql"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"github.com/uptrace/bun/extra/bundebug"
	"log"
	"ongoing/Entities"
	"ongoing/Utils/UUID"
	"os"
	"strings"
	"time"
)

var DB *bun.DB

func New() (*bun.DB, error) {
	dbname := os.Getenv("POSTGRES_DB")
	db := connect(os.Getenv("POSTGRES_DSN"), dbname)

	if os.Getenv("TRUNCATE_DB") == "true" {
		if strings.Contains(dbname, "prod") {
			panic("Refusing to wipe production database!")
		}
		wipeDatabases(db)
	}

	seedUserTable(db)

	log.Println("DB: all startup tests passed - connections established.")

	DB = db
	return db, nil
}

func connect(dsn, dbname string) *bun.DB {
	//log.Println("Connecting to DB", dbname)

	connector := pgdriver.NewConnector(pgdriver.WithDSN(dsn), pgdriver.WithDatabase(dbname))
	sqldb := sql.OpenDB(connector)
	db := bun.NewDB(sqldb, pgdialect.New())

	// Normal logging:
	db.AddQueryHook(bundebug.NewQueryHook())

	// Logs all queries - TODO control via env var
	//db.AddQueryHook(bundebug.NewQueryHook(bundebug.WithVerbose(true)))

	db.AddQueryHook(bundebug.NewQueryHook(
		bundebug.WithVerbose(true),
		bundebug.FromEnv("BUNDEBUG"),
	))

	for {
		_, err := db.Exec("SELECT 1")
		if err == nil {
			break
		}
		log.Println("DB test failed")
		log.Println(err.Error())
		time.Sleep(time.Second * 1)
	}
	return db
}

func wipeDatabases(appdb *bun.DB) {
	log.Println("DB: truncating")

	appdb.Exec(`
		CREATE OR REPLACE FUNCTION truncate_tables(_schema IN VARCHAR, _username IN VARCHAR) RETURNS void AS $$
			DECLARE
				statements CURSOR FOR
					SELECT tablename FROM pg_tables
					WHERE tableowner = _username AND schemaname = _schema;
			BEGIN
				FOR stmt IN statements LOOP
					EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
				END LOOP;
			END;
			$$ LANGUAGE plpgsql;`)

	if _, err := appdb.Exec("SELECT truncate_tables('public', 'postgres');"); err != nil {
		log.Fatal(err)
	}

	spicedb := connect(os.Getenv("POSTGRES_DSN"), "spicedb-local")
	defer func() {
		spicedb.Close()
	}()
	spicedb.Exec("DELETE FROM relation_tuple")
	spicedb.Exec("DELETE FROM relation_tuple_transaction WHERE id > 2;")
}

func seedUserTable(db *bun.DB) {
	for _, su := range GetSuperusers() {
		if len(su) > 0 {
			insertSuperuser(db, su)
		}
	}
}

func insertSuperuser(db *bun.DB, email string) {
	email = strings.TrimSpace(email)
	if exists, err := db.NewSelect().Model((*Entities.User)(nil)).Where("email = ?", email).Exists(context.TODO()); err != nil {
		panic(err.Error())
	} else if !exists {
		var user = Entities.User{
			Uid:   UUID.GenerateUID(nil),
			Email: email,
		}
		if _, err := db.NewInsert().
			Model(&user).
			Returning("Id"). // not working
			Exec(context.TODO()); err != nil {
			log.Println(errors.WithStack(err))
			panic(err.Error())
		}
	}
}

func RowCount(db *bun.DB) int {
	var rowCounts []Entities.RowCount
	if err := db.NewSelect().
		Model(&rowCounts).
		OrderExpr("n_live_tup DESC").Scan(context.TODO()); err != nil {
		panic(err.Error())
	}
	total := 0
	for _, rc := range rowCounts {
		if rc.Table == "__EFMigrationsHistory" {
			continue
		}
		total += rc.Count
	}
	return total
}

func GetSuperusers() []string {
	superusers := os.Getenv("ONGOING_SUPERUSERS")
	return strings.Split(superusers, ",")
}
