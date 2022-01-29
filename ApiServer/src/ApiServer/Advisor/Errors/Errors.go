package Errors

import (
	"fmt"
)

const PolicyHasDependentPortfolios = "Unable to delete - policy has dependent portfolios"
const PolicyFundDoesNotBelongToClient = "Policy fund does not belong to client"
const ClientAlreadyExists = "Client with this email already exists"

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
