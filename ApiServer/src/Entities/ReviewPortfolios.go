package Entities

import (
	"github.com/uptrace/bun"
)

type ReviewPortfolios struct {
	bun.BaseModel `bun:"table:review_portfolios"`

	Id           int64     `bun:"id,pk,autoincrement"`
	ModuleId     int64     `bun:"review_id,notnull"`
	PortfolioId  int64     `bun:"portfolio_id,notnull"`

	Module       *ReviewModule `bun:"rel:has-one,join:module_id=id"`
	Portfolio    *Portfolio    `bun:"rel:has-one,join:portfolio_id=id"`
}
