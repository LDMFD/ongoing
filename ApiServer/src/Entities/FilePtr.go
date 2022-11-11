package Entities

import (
	"github.com/uptrace/bun"
	"time"
)

type FilePtr struct {
	bun.BaseModel `bun:"table:file_ptrs"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	FileId    *int64    `bun:"file_id"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	File *File `bun:"rel:has-one,join:file_id=id"`
}

func (f FilePtr) ToReport() *ReportFile {
	if f.File.Uid == "" {
		return nil
	}
	return &ReportFile{
		Uid:      f.File.Uid,
		Filename: f.File.Filename,
		Size:     f.File.Size,
	}
}
