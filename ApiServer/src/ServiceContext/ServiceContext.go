package ServiceContext

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"ongoing/AuthService"
	"ongoing/Entities"
)

type Context struct {
	Db       *bun.DB
	Auth     *AuthService.Client
	Session  *Entities.ServerSessionContext
	Response Response
}

type Response struct {
	FrameworkContext *gin.Context

	// Error code
	Error *string `json:"error"`

	// Dependent resources for IntegrityViolation
	Resources *[]string `json:"resources"`

	// Trace for InternalError
	Trace *string `json:"trace"`
}

func (response *Response) AddResource(resource string) {
	if response.Resources == nil {
		response.Resources = &[]string{}
	}
	*response.Resources = append(*response.Resources, resource)
}

func (response *Response) CheckIntegrity() {
	if response.Resources != nil && len(*response.Resources) > 0 {
		response.error(http.StatusBadRequest, Errors.IntegrityViolation)
	}
}

func (response *Response) ReturnID(id *string) {
	var obj interface{}
	if id != nil {
		obj = gin.H{"Id": id}
	}
	response.FrameworkContext.JSON(200, obj)
}

func (response *Response) ReturnOK() {
	response.FrameworkContext.JSON(200, nil)
}
