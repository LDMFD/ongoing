package Funds

import (
	"ongoing/ApiServer/Funds/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", Commands.GetFunds)
	r.POST("", Commands.CreateFund)
	r.PUT("/:FundId", Commands.UpdateFund)
	r.DELETE("/:FundId", Commands.DeleteFund)
}
