package UUID

import (
	"ongoing/Config"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GenerateUID(c *gin.Context) string {
	var entityId string
	if Config.OFFLINE_AUTH && c != nil {
		entityId = c.GetHeader("X-Ongoing-EntityId")
	}
	if entityId == "" {
		uid := uuid.NewString()
		return strings.ReplaceAll(uid, "-", "")
	}
	return entityId
}

func GenerateUIDWithKey(c *gin.Context, key string) string {
	var entityId string
	if Config.OFFLINE_AUTH && c != nil {
		entityId = c.GetHeader("X-Ongoing-EntityId-" + key)
	}
	if entityId == "" {
		uid := uuid.NewString()
		return strings.ReplaceAll(uid, "-", "")
	}
	return entityId
}
