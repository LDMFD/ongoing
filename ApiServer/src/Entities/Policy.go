package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type Policy struct {
	bun.BaseModel `bun:"table:policies"`

	Id                   int64     `bun:"id,pk,autoincrement"`
	Uid                  string    `bun:"uid,notnull"`
	ClientId             int64     `bun:"client_id,notnull"`
	PolicyTypeId         int64     `bun:"policy_type_id,notnull"`
	PolicyProviderId     int64     `bun:"policy_provider_id,notnull"`
	ExternalId           string    `bun:"external_id,notnull"`
	MonthlyContributions int64     `bun:"monthly_contributions,notnull"`
	StartValue           int64     `bun:"start_value,notnull"`
	EndValue             int64     `bun:"end_value,notnull"`
	Timestamp            time.Time `bun:",nullzero,notnull,default:current_timestamp"`
	Notes                string    `bun:"notes,notnull"`
	FileId               *int64    `bun:"file_id"`

	Client         *Client         `bun:"rel:has-one,join:client_id=id"`
	Portfolios     []*Portfolio    `bun:"rel:has-many,join:id=client_id"`
	PolicyType     *PolicyType     `bun:"rel:has-one,join:policy_type_id=id"`
	PolicyProvider *PolicyProvider `bun:"rel:has-one,join:policy_provider_id=id"`
	File           *File           `bun:"rel:has-one,join:file_id=id"`
}

type ReportPolicy struct {
	Id                   string
	PolicyTypeId         string
	PolicyProviderId     string
	ExternalId           string
	MonthlyContributions int64
	StartValue           int64
	EndValue             int64
	Notes                string
	File                 *ReportFile
}

func (p *Policy) ToReport() ReportPolicy {
	rp := ReportPolicy{
		Id:                   p.Uid,
		PolicyTypeId:         p.PolicyType.Uid,
		PolicyProviderId:     p.PolicyProvider.Uid,
		ExternalId:           p.ExternalId,
		MonthlyContributions: p.MonthlyContributions,
		StartValue:           p.StartValue,
		EndValue:             p.EndValue,
		Notes:                p.Notes,
	}
	if p.File != nil {
		rp.File = p.File.ToReport()
	}
	return rp
}
