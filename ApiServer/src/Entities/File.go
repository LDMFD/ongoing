package Entities

import (
	"github.com/uptrace/bun"
	"time"
)

type File struct {
	bun.BaseModel `bun:"table:files"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	Filename  string    `bun:"filename,notnull"`
	Size      int64     `bun:"size,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Pointers []*FilePtr `bun:"rel:has-many,join:id=file_id"`
}

type RequestFile struct {
	Uid      string
	Filename string
	Size     int64
}

type ReportFile struct {
	Uid      string
	Filename string
	Size     int64
}
