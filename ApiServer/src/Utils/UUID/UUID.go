package UUID

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"strings"
)

func GenerateUID(c *gin.Context) string {
	var entityId string
	if c != nil {
		entityId = c.GetHeader("X-Amplifa-EntityId")
	}
	if entityId == "" {
		uid := uuid.NewString()
		return strings.ReplaceAll(uid, "-", "")
	}
	return entityId
}
