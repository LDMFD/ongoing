package Entities

import (
	"ongoing/Utils/Date"
	"time"

	"github.com/uptrace/bun"
)

type Model struct {
	bun.BaseModel `bun:"table:models"`

	Id                int64      `bun:"id,pk,autoincrement"`
	Uid               string     `bun:"uid,notnull"`
	OrgId             int64      `bun:"org_id"`
	Name              string     `bun:"name,notnull"`
	OperatorId        int64      `bun:"operator_id,notnull"`
	WeightedOcfFee    float64    `bun:"weighted_ocf_fee,notnull"`
	WeightedExAnteFee float64    `bun:"weighted_ex_ante_fee,notnull"`
	FileId            *int64     `bun:"file_id"`
	Modified          *time.Time `bun:",nullzero"`
	Timestamp         time.Time  `bun:",nullzero,notnull,default:current_timestamp"`

	Org        *Organisation `bun:"rel:has-one,join:org_id=id"`
	File       *File         `bun:"rel:has-one,join:file_id=id"`
	Operator   *Operator     `bun:"rel:has-one,join:operator_id=id"`
	Portfolios []*Portfolio  `bun:"rel:has-many,join:id=model_id"`
}

type ReportModel struct {
	Id                string
	Name              string
	OperatorId        string
	WeightedOcfFee    float64
	WeightedExAnteFee float64
	Modified          string
	File              *ReportFile
}

func (p *Model) ToReport() ReportModel {
	rm := ReportModel{
		Id:                p.Uid,
		Name:              p.Name,
		OperatorId:        p.Operator.Uid,
		WeightedOcfFee:    p.WeightedOcfFee,
		WeightedExAnteFee: p.WeightedExAnteFee,
		Modified:          Date.ToCanonical(p.Modified),
	}
	if p.File != nil {
		rm.File = p.File.ToReport()
	}
	return rm
}
