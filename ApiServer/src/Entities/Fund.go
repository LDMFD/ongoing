package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type Fund struct {
	bun.BaseModel `bun:"table:funds"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	Name      string    `bun:"name,notnull"`
	OcfFee    float64   `bun:"ocf_fee,notnull"`
	ExAnteFee float64   `bun:"ex_ante_fee,notnull"`
	FileId    *int64    `bun:"file_id"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	File        *File         `bun:"rel:has-one,join:file_id=id"`
	PolicyFunds []*PolicyFund `bun:"rel:has-many,join:id=fund_id"`
}

type ReportFund struct {
	Id         string
	Name       string
	OcfFee     float64
	ExAnteFee  float64
	File       struct {
		Uid      string
		Filename string
	}
}

func (f *Fund) ToReport() ReportFund {
	rf := ReportFund{
		Id:        f.Uid,
		Name:      f.Name,
		OcfFee:    f.OcfFee,
		ExAnteFee: f.ExAnteFee,
	}
	if f.File != nil {
		rf.File = ReportFile{
			Uid:      f.File.Uid,
			Filename: f.File.Filename,
		}
	}
	return rf
}
