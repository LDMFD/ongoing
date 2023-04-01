package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type RiskLevel struct {
	bun.BaseModel `bun:"table:risk_levels"`

	Id             int64     `bun:"id,pk,autoincrement"`
	Uid            string    `bun:"uid,notnull"`
	RiskProviderId int64     `bun:"risk_provider_id,notnull"`
	Level          int64     `bun:"level,notnull"`
	Label          string    `bun:"label,notnull"`
	Desc           string    `bun:"desc,notnull"`
	Timestamp      time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	RiskProvider *RiskProvider     `bun:"rel:has-one,join:risk_provider_id=id"`
	Assessments  []*RiskAssessment `bun:"rel:has-many,join:id=risk_level_id"`
}

type ReportRiskLevel struct {
	Id             string
	RiskProviderId string
	Level          int64
	Label          string
	Desc           string
}

func (p *RiskLevel) ToReport() ReportRiskLevel {
	return ReportRiskLevel{
		Id:             p.Uid,
		RiskProviderId: p.RiskProvider.Uid,
		Level:          p.Level,
		Label:          p.Label,
		Desc:           p.Desc,
	}
}
