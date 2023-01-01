package Entities

import (
	"github.com/uptrace/bun"
	"time"
)

var (
	UserTypeSuperuser = "superuser"
	UserTypeOrgOwner  = "owner"
	UserTypeOrgAdmin  = "administrator"
	UserTypeAdvisor   = "advisor"
	UserTypeClient    = "client"
)

type User struct {
	bun.BaseModel `bun:"table:users"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	Email     string    `bun:"email,notnull"`
	Forenames string    `bun:"forenames,notnull"`
	Surname   string    `bun:"surname,notnull"`
	Verified  bool      `bun:"verified,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`
}

type ReportUser struct {
	Id        string
	Email     string
	Forenames string
	Surname   string
}

func (u *User) ToReport() ReportUser {
	return ReportUser{
		Id:        u.Uid,
		Email:     u.Email,
		Forenames: u.Forenames,
		Surname:   u.Surname,
	}
}

type ServerSessionContext struct {
	UserId  int64
	UserUid string
	Email   string
	OrgId   *string
	Org     *Organisation
	Role    string
	IsHuman bool
}

type ClientSessionContext struct {
	ClientId string
	UserId   string
	Email    string
	OrgId    *string
	Role     string
}
