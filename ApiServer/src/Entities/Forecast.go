package Entities

import (
	"ongoing/Utils/Date"
	"time"

	"github.com/uptrace/bun"
)

type Forecast struct {
	bun.BaseModel `bun:"table:forecasts"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	ClientId  int64     `bun:"client_id,notnull"`
	FilePtrId *int64    `bun:"file_ptr_id"`
	Submitted time.Time `bun:",nullzero,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Client  *Client  `bun:"rel:has-one,join:client_id=id"`
	FilePtr *FilePtr `bun:"rel:has-one,join:file_ptr_id=id"`
}

type ReportForecast struct {
	Id        string
	Submitted string
	File      *ReportFile
}

func (a *Forecast) ToReport() ReportForecast {
	f := ReportForecast{
		Id:        a.Uid,
		Submitted: Date.ToCanonical(&a.Submitted),
	}
	if a.FilePtr != nil {
		f.File = a.FilePtr.ToReport()
	}
	return f
}
