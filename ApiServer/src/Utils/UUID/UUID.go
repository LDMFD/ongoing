package UUID

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GenerateUID(c *gin.Context) string {
	var entityId string
	if c != nil {
		entityId = c.GetHeader("X-Ongoing-EntityId") // TODO gate this to OFFLINE_AUTH?
	}
	if entityId == "" {
		uid := uuid.NewString()
		return strings.ReplaceAll(uid, "-", "")
	}
	return entityId
}

func GenerateUIDWithKey(c *gin.Context, key string) string {
	var entityId string
	if c != nil {
		entityId = c.GetHeader("X-Ongoing-EntityId-" + key)
	}
	if entityId == "" {
		uid := uuid.NewString()
		return strings.ReplaceAll(uid, "-", "")
	}
	return entityId
}
