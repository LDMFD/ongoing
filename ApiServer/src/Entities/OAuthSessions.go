package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type OAuthSession struct {
	bun.BaseModel `bun:"table:oauth_sessions"`

	Id            int64     `bun:"id,pk,autoincrement"`
	OrgId         int64     `bun:"org_id"`
	CreatorUserId int64     `bun:"creator_user_id"`
	State         string    `bun:"state,notnull"`
	AccessToken   string    `bun:"access_token,notnull"`
	RefreshToken  string    `bun:"refresh_token,notnull"`
	Expiry        time.Time `bun:"expiry,notnull"`
	Context       string    `bun:"context,notnull"`
	Timestamp     time.Time `bun:"timestamp,notnull,default:current_timestamp"`

	Org         *Organisation `bun:"rel:has-one,join:org_id=id"`
	CreatorUser *User         `bun:"rel:has-one,join:creator_user_id=id"`
}
