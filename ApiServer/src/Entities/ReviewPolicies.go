package Entities

import (
	"github.com/uptrace/bun"
)

type ReviewPolicies struct {
	bun.BaseModel `bun:"table:review_policies"`

	Id        int64     `bun:"id,pk,autoincrement"`
	ModuleId  int64     `bun:"review_id,notnull"`
	PolicyId  int64     `bun:"policy_id,notnull"`

	Module    *ReviewModule `bun:"rel:has-one,join:module_id=id"`
	Policy    *Policy       `bun:"rel:has-one,join:policy_id=id"`
}
