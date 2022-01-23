package Errors

import (
	"fmt"
)

var PolicyHasDependentPortfolios = "Unable to delete - policy has dependent portfolios"

func PolicyProviderHasDependentPolicies(policies string) string {
	return fmt.Sprintf("Policy provider has dependent policies: [ %v ]", policies)
}
