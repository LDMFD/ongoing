package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

var (
	ReviewStateDraft = "draft"
	ReviewStateFinal = "final"
)

type Review struct {
	bun.BaseModel `bun:"table:reviews"`

	Id            int64      `bun:"id,pk,autoincrement"`
	Uid           string     `bun:"uid,notnull"`
	ClientId      int64      `bun:"client_id,notnull"`
	State         string     `bun:"state,notnull,default:draft"`
	Report        *string    `bun:"report"`
	StartDate     *time.Time `bun:"start_date,nullzero,notnull,default:current_timestamp"`
	EndDate       *time.Time `bun:"end_date,nullzero,notnull,default:current_timestamp"`
	FinalizedDate time.Time  `bun:"finalized_date,nullzero,notnull"`

	Client *Client `bun:"rel:has-one,join:client_id=id"`
}

type ReportReviewMeta struct {
	StartDate     string
	EndDate       string
	FinalizedDate string
	State         string
}

func (r *Review) ToReportMeta() ReportReviewMeta {
	return ReportReviewMeta{
		StartDate:     r.StartDate.String(),
		EndDate:       r.EndDate.String(),
		FinalizedDate: r.FinalizedDate.String(),
		//State:         r.State,
	}
}
