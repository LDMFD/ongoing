package Helpers

import (
	"os"
	"strings"
)

func IsSuperuser(email string) bool {
	superusers := os.Getenv("ONGOING_SUPERUSERS")
	for _, su := range strings.Split(superusers, ",") { // duplicate logic with Database.GetSuperusers()
		su = strings.TrimSpace(su)
		if email == su {
			return true
		}
	}
	return false
}
