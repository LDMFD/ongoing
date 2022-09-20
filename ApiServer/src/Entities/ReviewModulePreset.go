package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type ModulePreset struct {
	bun.BaseModel `bun:"table:module_presets"`

	Id         int64         `bun:"id,pk,autoincrement"`
	Uid        string        `bun:"uid,notnull"`
	OrgId      int64         `bun:"org_id"`
	ModuleType string        `bun:"module_type,notnull"`
	Text       string        `bun:"text,notnull"`
	Org        *Organisation `bun:"rel:has-one,join:org_id=id"`
	Timestamp  time.Time     `bun:",nullzero,notnull,default:current_timestamp"`
}

type ReportModulePreset struct {
	Id         string
	ModuleType string
	Text       string
}

func (r *ModulePreset) ToReport() ReportModulePreset {
	return ReportModulePreset{
		Id:         r.Uid,
		ModuleType: r.ModuleType,
		Text:       r.Text,
	}
}
