package Funds

import (
	Commands "ongoing/ApiServer/Advisor/OrgResources/Funds/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.POST("", Commands.CreateFund)
	r.PUT("/:FundId", Commands.UpdateFund)
	r.DELETE("/:FundId", Commands.DeleteFund)
}
