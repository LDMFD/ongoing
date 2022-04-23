package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type RiskProvider struct {
	bun.BaseModel `bun:"table:risk_providers"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	Name      string    `bun:"name,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Levels  []*RiskLevel `bun:"rel:has-many,join:id=risk_provider_id"`
}

type ReportRiskProvider struct {
	Id      string
	Name    string
}

func (p *RiskProvider) ToReport() ReportRiskProvider {
	return ReportRiskProvider{
		Id:   p.Uid,
		Name: p.Name,
	}
}
