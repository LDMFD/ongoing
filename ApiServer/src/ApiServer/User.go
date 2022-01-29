package ApiServer

import (
	"github.com/gin-gonic/gin"
	"ongoing/Entities"
)

func getUser(c *gin.Context) {
	var userType string
	if user, exists := c.Get("USER"); exists {
		userType = user.(*Entities.User).Type
	} else {
		userType = "anonymous"
	}

	c.JSON(200, gin.H{
		"UserType": userType,
	})
}
