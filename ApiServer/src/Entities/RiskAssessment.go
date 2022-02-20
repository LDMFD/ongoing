package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type RiskAssessment struct {
	bun.BaseModel `bun:"table:risk_assessments"`

	Id        int64     `bun:"id,pk,autoincrement"`
	ClientId  int64     `bun:"client_id,notnull"`

	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Client    *Client         `bun:"rel:has-one,join:client_id=id"`
}
