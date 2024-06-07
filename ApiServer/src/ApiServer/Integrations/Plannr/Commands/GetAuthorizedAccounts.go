package Commands

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"io/ioutil"
	"net/http"
	"ongoing/ServiceContext"
)

type Account struct {
	UUID string `json:"uuid"`
	Name string `json:"name"`
}

type AccountData struct {
	Account Account `json:"account"`
}

type AccountResponse struct {
	Data []AccountData `json:"data"`
}

func GetAuthorizedAccounts(c *gin.Context, token string) (accounts []Account) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	baseURL := "https://api.plannrcrm.com/api/v1/logins"

	client := &http.Client{}
	req, err := http.NewRequest("GET", baseURL, nil)

	if err != nil {
		context.Panic(err)
	}
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

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

	//log.Println(string(body))

	if res.StatusCode != 200 {
		context.Panic(errors.New(string(body)))
	}

	var accountResponse AccountResponse
	err = json.Unmarshal(body, &accountResponse)
	if err != nil {
		context.Panic(err)
	}

	for _, account := range accountResponse.Data {
		accounts = append(accounts, account.Account)
	}

	return accounts
}
