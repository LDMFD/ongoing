package Advisor

import (
	"github.com/gin-gonic/gin"
)

// No-op to validate login
func getUser(c *gin.Context) {
	c.JSON(200, gin.H{})
}
