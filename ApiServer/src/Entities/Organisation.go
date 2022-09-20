package Entities

import (
	"github.com/uptrace/bun"
	"time"
)

type Organisation struct {
	bun.BaseModel `bun:"table:organisations"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	OwnerId   int64     `bun:"owner_id,notnull"`
	CreatorId int64     `bun:"creator_id,notnull"`
	Name      string    `bun:"name,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Owner   User `bun:"rel:has-one,join:owner_id=id"`
	Creator User `bun:"rel:has-one,join:creator_id=id"`
}

type ReportOrganisation struct {
	Id        string
	Name      string
	CreatorId string
	OwnerId   string
}

func (p *Organisation) ToReport() ReportOrganisation {
	return ReportOrganisation{
		Id:        p.Uid,
		Name:      p.Name,
		CreatorId: p.Creator.Uid,
		OwnerId:   p.Owner.Uid,
	}
}
