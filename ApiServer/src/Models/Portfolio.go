package Models

import (
	"github.com/uptrace/bun"
	"time"
)

type Portfolio struct {
	bun.BaseModel `bun:"table:portfolios"`

	Id 			int64  		`bun:"id,pk,autoincrement"`
	Name  	 	string 		`bun:"name,notnull"`
	OperatorId  int64 		`bun:"operator_id,notnull"`
	WeightedFee	float64     `bun:"weighted_ocf,notnull"`
	ExAnteFee	float64     `bun:"ex_ante_fee,notnull"`
	Timestamp   time.Time	`bun:",nullzero,notnull,default:current_timestamp"`
}
