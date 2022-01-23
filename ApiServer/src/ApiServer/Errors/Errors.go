package Errors

import (
	"fmt"
)

var PolicyHasDependentPortfolios = "Unable to delete - policy has dependent portfolios"

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