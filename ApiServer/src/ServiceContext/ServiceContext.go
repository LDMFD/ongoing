package ServiceContext

import (
	"github.com/uptrace/bun"
	"ongoing/AuthService"
	"ongoing/Entities"
)

type Context struct {
	Db       *bun.DB
	Auth     *AuthService.Client
	Session  *Entities.ServerSessionContext
	Response Response
}

func (ctx *Context) Panic(err error) {
	ctx.Response.Panic(err)
}
