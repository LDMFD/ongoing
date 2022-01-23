package Entities

import (
	"github.com/uptrace/bun"
	"time"
)

type Operator struct {
	bun.BaseModel `bun:"table:operators"`

	Id 			int64  		`bun:"id,pk,autoincrement"`
	Type     	string 		`bun:"type,notnull"`
	Name  	 	string 		`bun:"name,notnull"`
	Fee			float64     `bun:"fee,notnull"`
	Timestamp   time.Time	`bun:",nullzero,notnull,default:current_timestamp"`

	Models    []*Model      `bun:"rel:has-many,join:id=operator_id"`
}
