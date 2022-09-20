package Entities

import (
	"github.com/uptrace/bun"
	"time"
)

type Operator struct {
	bun.BaseModel `bun:"table:operators"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	OrgId     int64     `bun:"org_id"`
	Type      string    `bun:"type,notnull"`
	Name      string    `bun:"name,notnull"`
	Fee       float64   `bun:"fee,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Org    *Organisation `bun:"rel:has-one,join:org_id=id"`
	Models []*Model      `bun:"rel:has-many,join:id=operator_id"`
}

type ReportOperator struct {
	Id   string
	Type string
	Name string
	Fee  float64
}

func (p *Operator) ToReport() ReportOperator {
	return ReportOperator{
		Id:   p.Uid,
		Type: p.Type,
		Name: p.Name,
		Fee:  p.Fee,
	}
}
