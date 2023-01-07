package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type Portfolio struct {
	bun.BaseModel `bun:"table:portfolios"`

	Id           int64     `bun:"id,pk,autoincrement"`
	Uid          string    `bun:"uid,notnull"`
	ClientId     int64     `bun:"client_id,notnull"`
	PolicyId     int64     `bun:"policy_id,notnull"`
	ModelId      int64     `bun:"model_id,notnull"`
	Proportion   float64   `bun:"proportion,notnull"`
	IncludeInFee bool      `bun:"include_in_fee,notnull"`
	Timestamp    time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Client *Client `bun:"rel:has-one,join:client_id=id"`
	Policy *Policy `bun:"rel:has-one,join:policy_id=id"`
	Model  *Model  `bun:"rel:has-one,join:model_id=id"`
}

type ReportPortfolio struct {
	Id           string
	PolicyId     string
	ModelId      string
	Proportion   float64
	IncludeInFee bool
}

func (p *Portfolio) ToReport() ReportPortfolio {
	return ReportPortfolio{
		Id:           p.Uid,
		PolicyId:     p.Policy.Uid,
		ModelId:      p.Model.Uid,
		Proportion:   p.Proportion,
		IncludeInFee: p.IncludeInFee,
	}
}
