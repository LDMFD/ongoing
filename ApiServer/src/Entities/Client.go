package Entities

import (
	"github.com/uptrace/bun"
	"time"
)

type Client struct {
	bun.BaseModel `bun:"table:clients"`

	Id        int64     `bun:"id,pk,autoincrement"`
	Uid       string    `bun:"uid,notnull"`
	UserId    int64     `bun:"user_id,notnull"`
	OrgId     int64     `bun:"org_id,notnull"`
	Fee       float64   `bun:"fee,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	User              User                `bun:"rel:has-one,join:user_id=id"`
	Organisation      Organisation        `bun:"rel:has-one,join:org_id=id"`
	FactFinds         []*FactFind         `bun:"rel:has-many,join:id=client_id"`
	Forecasts         []*Forecast         `bun:"rel:has-many,join:id=client_id"`
	RiskAssessments   []*RiskAssessment   `bun:"rel:has-many,join:id=client_id"`
	FeesReports       []*FeesReport       `bun:"rel:has-many,join:id=client_id"`
	ProviderDiscounts []*ProviderDiscount `bun:"rel:has-many,join:id=client_id"`
	Policies          []*Policy           `bun:"rel:has-many,join:id=client_id"`
	PolicyFunds       []*PolicyFund       `bun:"rel:has-many,join:id=client_id"`
	Portfolios        []*Portfolio        `bun:"rel:has-many,join:id=client_id"`
	Modules           []*Module           `bun:"rel:has-many,join:id=client_id"`
	Reviews           []*Review           `bun:"rel:has-many,join:id=client_id"`
}

type ReportClientIdentity struct {
	Email     string
	Forenames string
	Surname   string
}

type ClientReport struct {
	Id        string
	UserId    string
	Identity  ReportClientIdentity
	Fee       float64 // TODO refactor floats to ints?
	AdvisorId string
}

func (c *Client) ToReport() ClientReport {
	return ClientReport{
		Id:     c.Uid,
		UserId: c.User.Uid,
		Identity: ReportClientIdentity{
			Email:     c.User.Email,
			Forenames: c.User.Forenames,
			Surname:   c.User.Surname,
		},
		Fee: c.Fee,
	}
}
