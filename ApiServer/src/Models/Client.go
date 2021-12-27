package Models

import (
	"github.com/uptrace/bun"
	"time"
)

type Client struct {
	bun.BaseModel `bun:"table:clients"`

	Id 			int64  `bun:"id,pk,autoincrement"`
	Uid     	string `bun:"uid,notnull"`
	Forenames  	string `bun:"forenames,notnull"`
	Surname    	string `bun:"surname,notnull"`
	Timestamp   time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Reviews 	[]*Review `bun:"rel:has-many,join:id=client_id"`
}
