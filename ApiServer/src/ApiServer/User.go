package ApiServer

import (
	"github.com/gin-gonic/gin"
	"ongoing/Entities"
)

func getUserInfo(c *gin.Context) {
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	res := Entities.ClientSessionContext{
		UserId: session.UserUid,
		Email:  session.Email,
		OrgId:  session.OrgId,
		Role:   session.Role,
	}

	c.JSON(200, gin.H{
		"Context": res,
	})
}
