package Errors

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun/driver/pgdriver"
	"net/http"
	"ongoing/Config"
	"ongoing/Database"
)

// TODO if msg is set, supress stdout errorlevel (example: "bad input")
func Unexpected(c *gin.Context, err error) {
	if f, ok := err.(pgdriver.Error); ok {
		if f.Field('C') == Database.PostgresUniqueViolation {
			c.JSON(http.StatusBadRequest, gin.H{
				// TODO align with ErrorState
				"error": UniqueViolation,
			})
		}
	}
	if Config.OFFLINE_AUTH && c.GetHeader("X-Ongoing-ExpectForbidden") == "true" {
		return
	}
	panic(err)
}

// BadRequest
const UniqueViolation = "duplicate_record"

// Unauthorized
const AccessViolation = "access_violation"

// BadRequest
const IntegrityViolation = "integrity_violation" // can't delete because dependencies exist

// BadRequest
const InvalidInput = "invalid_input" // can't bind path, query or json

// NotFound
const NotFound = "not_found"

// InternalServerError
const InternalError = "internal_error"

// Legacy:

const PolicyFundDoesNotBelongToClient = "Policy fund does not belong to client"
const LevelDoesNotBelongToProvider = "Level does not belong to provider"
