package Entities

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"time"
)

type Client struct {
	bun.BaseModel `bun:"table:clients"`

	Id        int64     `bun:"id,pk,autoincrement"`
	UserId    int64     `bun:"user_id,notnull"`
	Forenames string    `bun:"forenames,notnull"`
	Surname   string    `bun:"surname,notnull"`
	Fee       float64   `bun:"fee,notnull"`
	Timestamp time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	User              User                `bun:"rel:has-one,join:user_id=id"`
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
	Id       string
	Identity ReportClientIdentity
	Fee      float64 // TODO refactor?
}

func (c *Client) ToReport() ClientReport {
	return ClientReport{
		Id: c.User.Uid,
		Identity: ReportClientIdentity{
			Email:     c.User.Email,
			Forenames: c.Forenames,
			Surname:   c.Surname,
		},
		Fee: c.Fee,
	}
}

func ClientFromUserUID(c *gin.Context, db *bun.DB, uid string) Client {
	var user = User{}
	if err := db.NewSelect().
		Model(&user).
		Where("uid = ?", uid).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Client not found: " + uid})
		panic("client not found")
	}

	var client = Client{}
	if err := db.NewSelect().
		Model(&client).
		Where("user_id = ?", user.Id).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User isn't a client"})
		panic("client not found")
	}
	return client
}
