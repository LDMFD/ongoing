package Entities

import (
"time"

"github.com/uptrace/bun"
)

type ProviderDiscount struct {
	bun.BaseModel `bun:"table:provider_discounts"`

	Id               int64     `bun:"id,pk,autoincrement"`
	Uid              string    `bun:"uid,notnull"`
	ClientId         int64     `bun:"client_id,notnull"`
	PolicyProviderId int64     `bun:"policy_provider_id,notnull"`
	Discount         float64   `bun:"discount,notnull"`
	Timestamp        time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Client         *Client         `bun:"rel:has-one,join:client_id=id"`
	PolicyProvider *PolicyProvider `bun:"rel:has-one,join:policy_provider_id=id"`
}

type ReportProviderDiscount struct {
	Id               string
	PolicyProviderId string
	Discount         float64
}

func (p *ProviderDiscount) ToReport() ReportProviderDiscount {
	return ReportProviderDiscount{
		Id:               p.Uid,
		PolicyProviderId: p.PolicyProvider.Uid,
		Discount:         p.Discount,
	}
}
