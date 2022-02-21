package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type Fund struct {
	bun.BaseModel `bun:"table:funds"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Name      string    `bun:"name,notnull"`
	OcfFee    float64   `bun:"ocf_fee,notnull"`
	ExAnteFee float64   `bun:"ex_ante_fee,notnull"`
	FileId    *int64    `bun:"file_id"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	File        *File         `bun:"rel:has-one,join:file_id=id"`
	PolicyFunds []*PolicyFund `bun:"rel:has-many,join:id=fund_id"`
}
