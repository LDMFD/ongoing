package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type Job struct {
	bun.BaseModel `bun:"table:jobs"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	Jobspec   string    `bun:"jobspec,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`
}
