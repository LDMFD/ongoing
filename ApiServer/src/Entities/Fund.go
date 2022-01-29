package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type Fund struct {
	bun.BaseModel `bun:"table:funds"`

	Id          int64     `bun:"id,pk,autoincrement"`
	Name        string    `bun:"name,notnull"`
	WeightedFee float64   `bun:"weighted_ocf,notnull"`
	ExAnteFee   float64   `bun:"ex_ante_fee,notnull"`
	Timestamp   time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	PolicyFunds []*PolicyFund `bun:"rel:has-many,join:id=fund_id"`
}

