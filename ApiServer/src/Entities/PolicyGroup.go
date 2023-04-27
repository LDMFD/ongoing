package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type PolicyGroup struct {
	bun.BaseModel `bun:"table:policy_groups"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	OrgId     int64     `bun:"org_id"`
	Name      string    `bun:"name,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Org         *Organisation `bun:"rel:has-one,join:org_id=id"`
	PolicyTypes []*PolicyType `bun:"rel:has-many,join:id=group_id"`
}

type ReportPolicyGroup struct {
	Id   string
	Name string
}

func (p *PolicyGroup) ToReport() ReportPolicyGroup {
	return ReportPolicyGroup{
		Id:   p.Uid,
		Name: p.Name,
	}
}
