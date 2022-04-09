package ProviderCharges

import (
	Commands "ongoing/ApiServer/Advisor/Global/ProviderCharges/Commands"

	"github.com/gin-gonic/gin"
)

func AddRoutes(r *gin.RouterGroup) {
	r.POST("", Commands.CreateProviderCharge)
	r.PUT("/:ProviderChargeId", Commands.UpdateProviderCharge)
	r.DELETE("/:ProviderChargeId", Commands.DeleteProviderCharge)
}
