package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type ProviderCharge struct {
	bun.BaseModel `bun:"table:provider_charges"`

	Id         int64     `bun:"id,pk,autoincrement"`
	Uid        string    `bun:"uid,notnull"`
	ProviderId int64     `bun:"policy_provider_id,notnull"`
	Desc       string    `bun:"desc,notnull"`
	Charge     float64   `bun:"charge,notnull"`
	Sequence   int64     `bun:"sequence,notnull"`
	Timestamp  time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	PolicyProvider *PolicyProvider `bun:"rel:has-one,join:policy_provider_id=id"`
}

type ReportProviderCharge struct {
	Id         string
	ProviderId string
	Desc       string
	Charge     float64
	Sequence   int64
}

func (p *ProviderCharge) ToReport() ReportProviderCharge {
	return ReportProviderCharge{
		Id:         p.Uid,
		ProviderId: p.PolicyProvider.Uid,
		Desc:       p.Desc,
		Charge:     p.Charge,
		Sequence:   p.Sequence,
	}
}
