package Commands

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"io/ioutil"
	"net/http"
	"ongoing/Entities"
	"ongoing/ServiceContext"
)

type ClientInfo struct {
	UUID  string `json:"uuid"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type ClientsResponseData struct {
	Data []ClientInfo `json:"data"`
}

func GetClients(c *gin.Context) { //, token, accountId string) []ClientInfo {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db

	baseURL := "https://api.plannrcrm.com/api/v1/client"

	client := &http.Client{}
	req, err := http.NewRequest("GET", baseURL, nil)

	if err != nil {
		context.Panic(err)
	}

	var session = Entities.OAuthSession{}
	if err := db.NewSelect().
		Model(&session).
		Where("org_id = ?", context.Session.Org.Id).
		Where("context is not null").
		Scan(c); err != nil {
		context.Panic(err)
		return
	}

	req.Header.Set("Authorization", "Bearer "+session.AccessToken)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("X-PLANNR-ACCOUNT-UUID", session.Context)

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

	var clientsResponse ClientsResponseData
	err = json.Unmarshal(body, &clientsResponse)
	if err != nil {
		context.Panic(err)
	}

	c.JSON(200, gin.H{
		"Integrations": gin.H{
			"Plannr": gin.H{
				"Clients": clientsResponse.Data,
			},
		},
	})
}
