package Models

import (
	"github.com/uptrace/bun"
	"time"
)

type Review struct {
	bun.BaseModel `bun:"table:reviews"`

	Id 			int64  `bun:"id,pk,autoincrement"`
	Uid     	string `bun:"uid,notnull"`
	ClientId    int64 `bun:"client_id,notnull""`
	State     	string `bun:"state,notnull,default:DRAFT"`
	Timestamp   time.Time	`bun:",nullzero,notnull,default:current_timestamp"`

	// TODO add JSON report

	//Files 	[]*File `bun:"rel:has-many,join:id=review_id"`
}
