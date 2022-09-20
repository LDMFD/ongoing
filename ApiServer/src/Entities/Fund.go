package Entities

import (
	"ongoing/Utils/Date"
	"time"

	"github.com/uptrace/bun"
)

type Fund struct {
	bun.BaseModel `bun:"table:funds"`

	Id        int64      `bun:"id,pk,autoincrement"`
	Uid       string     `bun:"uid,notnull"`
	OrgId     int64      `bun:"org_id"`
	Name      string     `bun:"name,notnull"`
	OcfFee    float64    `bun:"ocf_fee,notnull"`
	ExAnteFee float64    `bun:"ex_ante_fee,notnull"`
	FileId    *int64     `bun:"file_id"`
	Modified  *time.Time `bun:",nullzero"`
	Timestamp time.Time  `bun:",nullzero,notnull,default:current_timestamp"`

	Org         *Organisation `bun:"rel:has-one,join:org_id=id"`
	File        *File         `bun:"rel:has-one,join:file_id=id"`
	PolicyFunds []*PolicyFund `bun:"rel:has-many,join:id=fund_id"`
}

type ReportFund struct {
	Id        string
	Name      string
	OcfFee    float64
	ExAnteFee float64
	Modified  string
	File      *ReportFile
}

func (f *Fund) ToReport() ReportFund {
	rf := ReportFund{
		Id:        f.Uid,
		Name:      f.Name,
		OcfFee:    f.OcfFee,
		ExAnteFee: f.ExAnteFee,
		Modified:  Date.ToCanonical(f.Modified),
	}
	if f.File != nil {
		rf.File = f.File.ToReport()
	}
	return rf
}
