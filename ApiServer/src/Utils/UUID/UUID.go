package UUID

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GenerateUID(c *gin.Context) string {
	var entityId string
	if c != nil {
		entityId = c.GetHeader("X-Ongoing-EntityId")
	}
	if entityId == "" {
		uid := uuid.NewString()
		return strings.ReplaceAll(uid, "-", "")
	}
	return entityId
}
