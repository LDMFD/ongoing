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
	Boundary   float64   `bun:"boundary,notnull"`
	Charge     float64   `bun:"charge,notnull"`
	Timestamp  time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	PolicyProvider *PolicyProvider `bun:"rel:has-one,join:policy_provider_id=id"`
}

type ReportProviderCharge struct {
	Id         string
	ProviderId string
	Boundary   float64
	Charge     float64
}

func (p *ProviderCharge) ToReport() ReportProviderCharge {
	return ReportProviderCharge{
		Id:         p.Uid,
		ProviderId: p.PolicyProvider.Uid,
		Boundary:   p.Boundary,
		Charge:     p.Charge,
	}
}
