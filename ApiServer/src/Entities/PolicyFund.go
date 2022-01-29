package Entities

import (
	"github.com/uptrace/bun"
	"time"
)

type PolicyFund struct {
	bun.BaseModel `bun:"table:policy_funds"`

	Id           int64     `bun:"id,pk,autoincrement"`
	ClientId     int64     `bun:"client_id,notnull""`
	FundId       int64     `bun:"fund_id,notnull""`
	PolicyId     int64     `bun:"policy_id,notnull""`
	Proportion   float64   `bun:"proportion,notnull"`
	Timestamp    time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Client      *Client `bun:"rel:has-one,join:client_id=id"`
}

