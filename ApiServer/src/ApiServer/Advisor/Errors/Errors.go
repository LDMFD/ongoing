package Errors

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun/driver/pgdriver"
	"net/http"
	"ongoing/Config"
	"ongoing/Database"
)

const UniqueViolation = "unique_violation"

const PolicyNumberAlreadyExists = "A policy with this policy number already exists."
const PolicyHasDependentPortfolios = "Unable to delete - policy has dependent portfolios"
const PolicyFundDoesNotBelongToClient = "Policy fund does not belong to client"
const UserAlreadyExists = "A user with this email already exists"
const LevelDoesNotBelongToProvider = "Level does not belong to provider"
const ChargesExist = "Policy has charges that must be deleted first"

func PolicyProviderHasDependentPolicies(policies string) string {
	return fmt.Sprintf("Policy provider has dependent policies: [ %v ]", policies)
}

func PolicyTypeHasDependentPolicies(policies string) string {
	return fmt.Sprintf("Policy type has dependent policies: [ %v ]", policies)
}

func OperatorHasDependentModels(models string) string {
	return fmt.Sprintf("Operator has dependent models: [ %s ]", models)
}

func FundHasDependentModels(models string) string {
	return fmt.Sprintf("Fund has dependent models: [ %s ]", models)
}

func ModelHasDependentPortfolios(models string) string {
	return fmt.Sprintf("Model has dependent portfolios: [ %s ]", models)
}

func HandleError(c *gin.Context, err error) {
	f := err.(pgdriver.Error)
	if f.Field('C') == Database.PostgresUniqueViolation {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "unique_violation",
		})
	}
	if Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true" {
		return
	}
	panic(err)
}
