package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type Portfolio struct {
	bun.BaseModel `bun:"table:portfolios"`

	Id         int64     `bun:"id,pk,autoincrement"`
	ClientId   int64     `bun:"client_id,notnull""`
	PolicyId   int64     `bun:"policy_id,notnull""`
	ModelId    int64     `bun:"model_id,notnull"`
	Proportion float64   `bun:"proportion,notnull"`
	Timestamp  time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Client      *Client `bun:"rel:has-one,join:client_id=id"`
}
