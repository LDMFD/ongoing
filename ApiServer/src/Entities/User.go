package Entities

import (
	"github.com/uptrace/bun"
	"time"
)

var (
	UserTypeAdmin   = "admin"
	UserTypeAdvisor = "advisor"
	UserTypeClient  = "client"
)

type User struct {
	bun.BaseModel `bun:"table:users"`

	Id 			int64  		`bun:"id,pk,autoincrement"`
	Uid  	 	string 		`bun:"uid,notnull"`
	Email  	 	string 		`bun:"email,notnull"`
	Verified    bool        `bun:"verified,notnull"`
	Type     	string 		`bun:"type,notnull"`
	Timestamp   time.Time	`bun:",nullzero,notnull,default:current_timestamp"`
}
