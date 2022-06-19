package Entities

import (
	Date "ongoing/Utils"
	"time"

	"github.com/uptrace/bun"
)

type FactFind struct {
	bun.BaseModel `bun:"table:fact_finds"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	ClientId  int64     `bun:"client_id,notnull"`
	FileId    *int64    `bun:"file_id"`
	Submitted time.Time `bun:",nullzero,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Client *Client `bun:"rel:has-one,join:client_id=id"`
	File   *File   `bun:"rel:has-one,join:file_id=id"`
}

type ReportFactFind struct {
	Id        string
	Submitted string
	File      struct {
		Uid      string
		Filename string
	}
}

func (a *FactFind) ToReport() ReportFactFind {
	return ReportFactFind{
		Id: a.Uid,
		Submitted: Date.ToCanonical(&a.Submitted),
		File: ReportFile{
			Uid:      a.File.Uid,
			Filename: a.File.Filename,
		},
	}
}
