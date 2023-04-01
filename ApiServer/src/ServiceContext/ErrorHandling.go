package ServiceContext

import (
	sentrygin "github.com/getsentry/sentry-go/gin"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Errors"
	"os"
)

func (response *Response) error(statuscode int, errcode string) {
	var res = gin.H{"error": errcode}
	if response.Resources != nil {
		res["resources"] = response.Resources
	}
	if response.Trace != nil {
		res["trace"] = response.Trace
	}
	response.FrameworkContext.JSON(statuscode, res)
}

func (response *Response) UniqueViolation() {
	response.error(http.StatusBadRequest, Errors.UniqueViolation)
}

func (response *Response) AccessViolation() {
	response.error(http.StatusUnauthorized, Errors.AccessViolation)
}

func (response *Response) IntegrityViolation() {
	response.error(http.StatusOK, Errors.IntegrityViolation)
}

func (response *Response) InvalidInput() {
	response.error(http.StatusBadRequest, Errors.InvalidInput)
}

func (response *Response) NotFound() {
	response.error(http.StatusNotFound, Errors.NotFound)
}

func (response *Response) Panic(err error) {
	if os.Getenv("ONGOING_SENTRY_DSN") != "" {
		if hub := sentrygin.GetHubFromContext(response.FrameworkContext); hub != nil {
			scope := hub.Scope()
			scope.SetTag("ongoing.trace", *response.Trace)
		}
	}
	response.error(http.StatusInternalServerError, Errors.InternalError)
	log.Println("Trace ID:" + *response.Trace)
	panic(err.Error())
}
