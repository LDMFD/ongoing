package Entities

import (
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
	File      struct {
		Uid      string
		Filename string
	}
}

func (a *FeesReport) ToReport() ReportFeesReport {
	return ReportFeesReport{
		Id: a.Uid,
		Submitted: a.Submitted.Format("02-01-2006"),
		File: ReportFile{
			Uid:      a.File.Uid,
			Filename: a.File.Filename,
		},
	}
}
