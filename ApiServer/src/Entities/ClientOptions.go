package Entities

import (
	"github.com/uptrace/bun"
)

type ClientOptions struct {
	bun.BaseModel `bun:"table:client_options"`

	Id       int64   `bun:"id,pk,autoincrement"`
	ClientId int64   `bun:"client_id,notnull"`
	Options  *string `bun:"options"`

	Client *Client `bun:"rel:has-one,join:client_id=id"`
}

type ReportClientOptions struct {
	Options interface{}
}

func (options *ClientOptions) ToReport() ReportClientOptions {
	ff := ReportClientOptions{}
	if options.Options == nil {
		return ff
	}
	ff.Options = *options.Options
	return ff
}
