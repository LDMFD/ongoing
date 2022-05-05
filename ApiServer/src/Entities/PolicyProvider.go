package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type PolicyProvider struct {
	bun.BaseModel `bun:"table:policy_providers"`

	Id            int64     `bun:"id,pk,autoincrement"`
	Uid           string    `bun:"uid,notnull"`
	Name          string    `bun:"name,notnull"`
	Pricing       string    `bun:"pricing,notnull"`
	CustomPricing string    `bun:"custom_pricing,notnull"`
	Timestamp     time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Policies []*Policy         `bun:"rel:has-many,join:id=policy_provider_id"`
	Charges  []*ProviderCharge `bun:"rel:has-many,join:id=policy_provider_id"`
}

type ReportPolicyProvider struct {
	Id            string
	Name          string
	Pricing       string
	CustomPricing string
}

func (p *PolicyProvider) ToReport() ReportPolicyProvider {
	return ReportPolicyProvider{
		Id:            p.Uid,
		Name:          p.Name,
		Pricing:       p.Pricing,
		CustomPricing: p.CustomPricing,
	}
}
