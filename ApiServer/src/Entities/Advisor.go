package Entities

import (
	"github.com/uptrace/bun"
	"time"
)

type Advisor struct {
	bun.BaseModel `bun:"table:advisors"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	UserId    int64     `bun:"user_id,notnull"`
	OrgId     int64     `bun:"org_id,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	User         User         `bun:"rel:has-one,join:user_id=id"`
	Organisation Organisation `bun:"rel:has-one,join:org_id=id"`
}

type AdvisorReport struct {
	Id        string
	Email     string
	Forenames string
	Surname   string
	Role      string
}

func (c *Advisor) ToReport(role string) AdvisorReport {
	return AdvisorReport{
		Id:        c.Uid,
		Email:     c.User.Email,
		Forenames: c.User.Forenames,
		Surname:   c.User.Surname,
		Role:      role,
	}
}
