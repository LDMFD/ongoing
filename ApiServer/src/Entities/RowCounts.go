package Entities

import "github.com/uptrace/bun"

type RowCount struct {
	bun.BaseModel `bun:"table:pg_stat_user_tables"`

	Schema string `bun:"schemaname,notnull"`
	Table  string `bun:"relname,notnull"`
	Count  int    `bun:"n_live_tup,notnull"`
}
