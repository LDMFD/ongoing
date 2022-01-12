package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type Model struct {
	bun.BaseModel `bun:"table:models"`

	Id          int64     `bun:"id,pk,autoincrement"`
	Name        string    `bun:"name,notnull"`
	OperatorId  int64     `bun:"operator_id,notnull"`
	WeightedFee float64   `bun:"weighted_ocf,notnull"`
	ExAnteFee   float64   `bun:"ex_ante_fee,notnull"`
	FileId      *int64    `bun:"file_id"`
	Timestamp   time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	File *File `bun:"rel:has-one,join:file_id=id"`
}
