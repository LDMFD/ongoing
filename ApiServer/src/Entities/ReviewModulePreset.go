package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type ModulePreset struct {
	bun.BaseModel `bun:"table:module_presets"`

	Id         int64     `bun:"id,pk,autoincrement"`
	ModuleType string    `bun:"module_type,notnull"`
	Text       string    `bun:"text,notnull"`
	Timestamp  time.Time `bun:",nullzero,notnull,default:current_timestamp"`
}

type ReportModulePreset struct {
	Id         int64
	ModuleType string
	Text       string
}

func (r *ModulePreset) ToReport() ReportModulePreset {
	return ReportModulePreset{
		Id:         r.Id,
		ModuleType: r.ModuleType,
		Text:       r.Text,
	}
}
