package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type Policy struct {
	bun.BaseModel `bun:"table:policies"`

	Id               int64     `bun:"id,pk,autoincrement"`
	ClientId         int64     `bun:"client_id,notnull""`
	PolicyTypeId     int64     `bun:"policy_type_id,notnull""`
	PolicyProviderId int64     `bun:"policy_provider_id,notnull""`
	ExternalId       string    `bun:"external_id,notnull"`
	PlatformDiscount float64   `bun:"platform_discount,notnull"`
	Timestamp        time.Time `bun:",nullzero,notnull,default:current_timestamp"`
}
