package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

var (
	ReviewStateDraft = "draft"
	ReviewStateFinal = "final"
)

type Review struct {
	bun.BaseModel `bun:"table:reviews"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	ClientId  int64     `bun:"client_id,notnull"`
	State     string    `bun:"state,notnull,default:draft"`
	Report    *string   `bun:"report,notnull"`
	Started   time.Time `bun:"started,nullzero,notnull,default:current_timestamp"`
	Finalized time.Time `bun:"finalized,nullzero,notnull"`

	Client    *Client         `bun:"rel:has-one,join:client_id=id"`
	Modules   []*ReviewModule `bun:"rel:has-many,join:id=review_id"`
}
