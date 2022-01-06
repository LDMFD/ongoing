package Models

import (
	"time"

	"github.com/uptrace/bun"
)

type PolicyProvider struct {
	bun.BaseModel `bun:"table:policy_providers"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Name      string    `bun:"name,notnull"`
	Pricing   string    `bun:"pricing,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`
}
