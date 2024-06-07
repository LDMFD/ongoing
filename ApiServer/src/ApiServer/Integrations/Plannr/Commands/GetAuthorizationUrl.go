package Commands

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/url"
	"ongoing/Entities"
	"ongoing/ServiceContext"
	"ongoing/Utils/UUID"
	"os"
)

func GetAuthorizationUrl(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	// OAuth 2.0 state
	state := UUID.GenerateUID(nil)

	uri := getAuthorizationUrl(context, state)

	persistSession(context, state)

	c.JSON(200, gin.H{
		"Url":   uri,
		"State": state, // saved in cookie for future queries
	})
}

func getAuthorizationUrl(context *ServiceContext.Context, state string) string {
	clientId := os.Getenv("ONGOING_INTEGRATIONS_PLANNR_CLIENT_ID")
	redirectUri := "http://localhost.amplifa.co.uk:3000/redirect"

	baseURL := "https://api.plannrcrm.com/oauth/authorize"
	u, err := url.Parse(baseURL)
	if err != nil {
		context.Panic(err)
	}

	q := u.Query()
	q.Set("response_type", "code")
	q.Set("client_id", clientId)
	q.Set("redirect_uri", redirectUri)
	q.Set("scope", "*")
	q.Set("state", state)
	u.RawQuery = q.Encode()

	return u.String()
}

func persistSession(context *ServiceContext.Context, state string) {
	c := context.Response.FrameworkContext

	var session = Entities.OAuthSession{
		OrgId:         context.Session.Org.Id,
		CreatorUserId: context.Session.UserId,
		State:         state,
	}

	tx, err := context.Db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Panic(err)
	}
	defer tx.Rollback()

	if _, err := tx.NewDelete().
		Model(&session).
		Where("org_id = ?", context.Session.Org.Id).
		Exec(c); err != nil {
		context.Panic(err)
	}

	if _, err := tx.NewInsert().
		Model(&session).
		Exec(c); err != nil {
		context.Panic(err)
	}

	if err := tx.Commit(); err != nil {
		context.Panic(err)
	}
}
