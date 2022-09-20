package main

import (
	"github.com/pkg/errors"
	"log"
	"net/http"
	"ongoing/Tests/TestSuite"
	"os"
	"testing"

	"github.com/gavv/httpexpect/v2"
	"github.com/gin-gonic/gin"
)

var router *gin.Engine
var expect *httpexpect.Expect

func init() {
	// Removes debug output, including the list of routes printed at startup
	gin.SetMode(gin.TestMode)
}

func TestMain(m *testing.M) {
	app, err := buildApp()
	if err != nil {
		log.Fatalf("%+v\n", errors.WithStack(err))
	}

	//var router *gin.Engine
	if router, err = app.GetRouter(); err != nil {
		log.Fatalf(err.Error())
	}

	code := m.Run()
	os.Exit(code)
}

func ConfigureExpect(t *testing.T) *httpexpect.Expect {
	config := httpexpect.Config{
		Client: &http.Client{
			Transport: httpexpect.NewBinder(router),
			Jar:       httpexpect.NewJar(),
		},
		Reporter: httpexpect.NewAssertReporter(t),
	}
	// Uncomment for request debugging
	//config.Printers = []httpexpect.Printer{
	//	httpexpect.NewDebugPrinter(t, true),
	//}
	return httpexpect.WithConfig(config)
}

func TestAll(t *testing.T) {
	expect = ConfigureExpect(t)
	TestSuite.TestAll(t, expect)
}
