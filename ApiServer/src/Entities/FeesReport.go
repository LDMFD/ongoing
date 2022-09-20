package Entities

import (
	"ongoing/Utils/Date"
	"time"

	"github.com/uptrace/bun"
)

type FeesReport struct {
	bun.BaseModel `bun:"table:fees_reports"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	ClientId  int64     `bun:"client_id,notnull"`
	FileId    *int64    `bun:"file_id"`
	Submitted time.Time `bun:",nullzero,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Client *Client `bun:"rel:has-one,join:client_id=id"`
	File   *File   `bun:"rel:has-one,join:file_id=id"`
}

type ReportFeesReport struct {
	Id        string
	Submitted string
	File      *ReportFile
}

func (a *FeesReport) ToReport() ReportFeesReport {
	return ReportFeesReport{
		Id:        a.Uid,
		Submitted: Date.ToCanonical(&a.Submitted),
		File:      a.File.ToReport(),
	}
}
