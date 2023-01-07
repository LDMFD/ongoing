package Entities

import (
	"github.com/uptrace/bun"
	"time"
)

type PolicyFund struct {
	bun.BaseModel `bun:"table:policy_funds"`

	Id           int64     `bun:"id,pk,autoincrement"`
	Uid          string    `bun:"uid,notnull"`
	ClientId     int64     `bun:"client_id,notnull"`
	FundId       int64     `bun:"fund_id,notnull"`
	PolicyId     int64     `bun:"policy_id,notnull"`
	Proportion   float64   `bun:"proportion,notnull"`
	IncludeInFee bool      `bun:"include_in_fee,notnull"`
	Timestamp    time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Client *Client `bun:"rel:has-one,join:client_id=id"`
	Fund   *Fund   `bun:"rel:has-one,join:fund_id=id"`
	Policy *Policy `bun:"rel:has-one,join:policy_id=id"`
}

type ReportPolicyFund struct {
	Id           string
	FundId       string
	PolicyId     string
	Proportion   float64
	IncludeInFee bool
}

func (p *PolicyFund) ToReport() ReportPolicyFund {
	return ReportPolicyFund{
		Id:           p.Uid,
		FundId:       p.Fund.Uid,
		PolicyId:     p.Policy.Uid,
		Proportion:   p.Proportion,
		IncludeInFee: p.IncludeInFee,
	}
}
