package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type DiligenceTemplate struct {
	bun.BaseModel `bun:"table:diligence_templates"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Label     string    `bun:"label,notnull"`
	Text      string    `bun:"text,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`
}
