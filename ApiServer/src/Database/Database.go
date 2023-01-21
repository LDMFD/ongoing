package Database

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
	"log"
	"ongoing/Entities"
	"os"
	"strings"
	"time"
)

const PostgresUniqueViolation = "23505"

var DB *bun.DB
var hook *QueryHook

func New() (*bun.DB, error) {
	dbname := os.Getenv("POSTGRES_DB")
	db := connect(os.Getenv("POSTGRES_DSN"), dbname)

	if os.Getenv("TRUNCATE_DB") == "true" {
		if strings.Contains(dbname, "prod") {
			panic("Refusing to wipe production database!")
		}
		Truncate(db)
	}

	SeedUserTable(db)

	log.Println("DB: Connected.")

	DB = db
	return db, nil
}

func connect(dsn, dbname string) *bun.DB {
	//log.Println("Connecting to DB", dbname)

	connector := pgdriver.NewConnector(pgdriver.WithDSN(dsn), pgdriver.WithDatabase(dbname))
	sqldb := sql.OpenDB(connector)
	db := bun.NewDB(sqldb, pgdialect.New())

	// Custom query hook to disable logs when X-Ongoing-ExpectForbidden is set
	db.AddQueryHook(NewQueryHook())

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

func Truncate(appdb *bun.DB) {
	log.Println("DB: Truncating...")

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

	spicedb := connect(os.Getenv("POSTGRES_DSN"), os.Getenv("ONGOING_SPICEDB_DB"))
	defer func() {
		spicedb.Close()
	}()
	spicedb.Exec("DELETE FROM relation_tuple")
	spicedb.Exec("DELETE FROM relation_tuple_transaction WHERE id > 2;")
}

func SeedUserTable(db *bun.DB) {
	for _, su := range GetSuperusers() {
		if len(su) > 0 {
			insertSuperuser(db, su)
		}
	}
}

func insertSuperuser(db *bun.DB, email string) {
	email = strings.TrimSpace(email)

	if exists, err := db.NewSelect().
		Model((*Entities.User)(nil)).
		Where("email = ?", email).Exists(context.TODO()); err != nil {
		panic(err.Error())
	} else if !exists {
		var user = Entities.User{
			Uid:   email[:strings.Index(email, "@")],
			Email: email,
		}
		if _, err := db.NewInsert().
			Model(&user).
			Exec(context.TODO()); err != nil {
			log.Println(errors.WithStack(err))
			panic(err.Error())
		}
	}
}

func RowCount(db *bun.DB) int {
	app := AppDbRows(db)
	auth := AuthDbRows()
	return app + auth
}

func AuthDbRows() int {
	spicedb := connect(os.Getenv("POSTGRES_DSN"), os.Getenv("ONGOING_SPICEDB_DB"))
	var relations int
	defer func() {
		spicedb.Close()
	}()
	var row *sql.Row
	row = spicedb.QueryRow("SELECT COUNT(*) FROM relation_tuple WHERE deleted_transaction = 9223372036854775807;")
	if err := row.Scan(&relations); err != nil {
		panic(err.Error())
	}
	return relations
}

func AppDbRows(db *bun.DB) int {
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

		var count int
		sql := fmt.Sprintf("SELECT COUNT(*) AS count FROM %s", rc.Table)
		db.QueryRow(sql).Scan(&count)

		// If any table is not empty (except for users which should have at minimum 1 row for each superuser)
		suppressWarning := rc.Table == "users" && count == len(GetSuperusers())
		if count != 0 && !suppressWarning {
			log.Println("Non-empty table:", rc.Table)
		}
		total += count
	}
	return total
}

func GetSuperusers() []string {
	superusers := os.Getenv("ONGOING_SUPERUSERS")
	return strings.Split(superusers, ",") // duplicate logic with Superuser.IsSuperuser()
}
