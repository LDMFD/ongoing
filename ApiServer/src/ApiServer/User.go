package ApiServer

import (
	"github.com/gin-gonic/gin"
)

func (s *ApiServer) getUser(c *gin.Context) {
	c.JSON(200, gin.H{})
}
