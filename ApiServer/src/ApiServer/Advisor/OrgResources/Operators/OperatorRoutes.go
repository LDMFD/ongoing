package Operators

import (
	Commands "ongoing/ApiServer/Advisor/OrgResources/Operators/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.POST("", Commands.CreateOperator)
	r.PUT("/:OperatorId", Commands.UpdateOperator)
	r.DELETE("/:OperatorId", Commands.DeleteOperator)
}
