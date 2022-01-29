package Entities

import (
	"github.com/uptrace/bun"
	"time"
)

type Client struct {
	bun.BaseModel `bun:"table:clients"`

	Id 			int64      `bun:"id,pk,autoincrement"`
	UserId     	int64      `bun:"user_id,notnull"`
	Forenames  	string     `bun:"forenames,notnull"`
	Surname    	string     `bun:"surname,notnull"`
	Timestamp   time.Time  `bun:",nullzero,notnull,default:current_timestamp"`

	User        User          `bun:"rel:has-one,join:user_id=id"`
	Policies    []*Policy     `bun:"rel:has-many,join:id=client_id"`
	PolicyFunds []*PolicyFund `bun:"rel:has-many,join:id=client_id"`
	Portfolios  []*Portfolio  `bun:"rel:has-many,join:id=client_id"`
	Reviews     []*Review     `bun:"rel:has-many,join:id=client_id"`
}
