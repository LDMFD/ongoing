package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type PolicyType struct {
	bun.BaseModel `bun:"table:policy_types"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Name      string    `bun:"name,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Policies  []*Policy `bun:"rel:has-many,join:id=policy_type_id"`
}
