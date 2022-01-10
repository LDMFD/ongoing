package Portfolios

import (
	"ongoing/ApiServer/Portfolios/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.GET("", Commands.GetPortfolios)
	r.POST("", Commands.CreatePortfolio)
	//r.GET("/:PortfolioId", Commands.GetPortfolio)
	r.PUT("/:PortfolioId", Commands.UpdatePortfolio)
}
