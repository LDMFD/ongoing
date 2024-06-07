package Commands

import (
	"database/sql"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"io/ioutil"
	"net/http"
	"net/url"
	"ongoing/Entities"
	"ongoing/ServiceContext"
	"os"
	"strings"
	"time"
)

type GetTokenQuery struct {
	Code  string `binding:"required" form:"code"`
	State string `binding:"required" form:"state"`
}

// Response from Plannr
type TokenResponse struct {
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

func GetAccessToken(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	var query GetTokenQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		context.Response.InvalidInput()
		return
	}

	tokenResponse := getToken(context, &query)

	// TODO test with Paul's account having access to both
	accounts := GetAuthorizedAccounts(c, tokenResponse.AccessToken)

	expiresIn := time.Duration(tokenResponse.ExpiresIn) * time.Second

	establishSession(context, query.State, tokenResponse.AccessToken, tokenResponse.RefreshToken, expiresIn)

	c.JSON(200, gin.H{
		"Integrations": gin.H{
			"Plannr": gin.H{
				"Accounts": accounts,
			},
		},
	})
}

func getToken(context *ServiceContext.Context, query *GetTokenQuery) *TokenResponse {
	baseURL := "https://api.plannrcrm.com/oauth/token"

	plannrClientId := os.Getenv("ONGOING_INTEGRATIONS_PLANNR_CLIENT_ID")
	plannrClientSecret := os.Getenv("ONGOING_INTEGRATIONS_PLANNR_CLIENT_SECRET")

	data := url.Values{}
	data.Set("grant_type", "authorization_code")
	data.Set("code", query.Code)
	data.Set("redirect_uri", "http://localhost.amplifa.co.uk:3000/redirect")
	data.Set("client_id", plannrClientId)
	data.Set("client_secret", plannrClientSecret)

	client := &http.Client{}
	req, err := http.NewRequest("POST", baseURL, strings.NewReader(data.Encode()))

	if err != nil {
		context.Panic(err)
	}
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	res, err := client.Do(req)
	if err != nil {
		context.Panic(err)
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		context.Panic(err)
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		context.Panic(errors.New(string(body)))
	}

	var tokenResponse TokenResponse
	err = json.Unmarshal(body, &tokenResponse)
	if err != nil {
		context.Panic(err)
	}
	return &tokenResponse
}

func establishSession(context *ServiceContext.Context, state, accessToken, refreshToken string, expiresIn time.Duration) {
	c := context.Response.FrameworkContext
	db := context.Db

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Panic(err)
	}
	defer tx.Rollback()

	var session = Entities.OAuthSession{}
	if err := db.NewSelect().
		Model(&session).
		Where("state = ?", state).
		Scan(c); err != nil {
		context.Panic(err)
	}

	session.AccessToken = accessToken
	session.RefreshToken = refreshToken
	session.Expiry = time.Now().Add(expiresIn)

	if _, err := tx.NewUpdate().
		Model(&session).
		Where("state = ?", state).
		Column("access_token").
		Column("expiry").
		Column("refresh_token").
		Exec(c); err != nil {
		context.Panic(err)
	}

	if err := tx.Commit(); err != nil {
		context.Panic(err)
	}
}
