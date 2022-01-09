package Models

import (
	"time"

	"github.com/uptrace/bun"
)

type Holding struct {
	bun.BaseModel `bun:"table:holdings"`

	Id               int64     `bun:"id,pk,autoincrement"`
	ClientId         int64     `bun:"client_id,notnull""`
	PolicyId         int64     `bun:"policy_id,notnull""`
	PortfolioId      int64     `bun:"portfolio_id,notnull"`
	Proportion       float64   `bun:"proportion,notnull"`
	Timestamp        time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	//Policy 		*Policy `bun:"rel:has-one,join:id=client_id"`
	//Portfolio 	*Policy `bun:"rel:has-one,join:id=id"`
}
