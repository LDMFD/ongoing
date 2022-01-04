package ApiServer

import (
	"context"
	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"github.com/gin-gonic/gin"

	"net/http"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			app *firebase.App
			client *auth.Client
			token *auth.Token
			err error
		)
		jwt := c.GetHeader("Authentication")

		if app, err = firebase.NewApp(context.Background(), nil); err != nil {
			panic(err)
		}
		if client, err = app.Auth(context.Background()); err != nil {
			panic(err)
		}

		// Check valid Google token
		if token, err = client.VerifyIDToken(context.Background(), jwt); err != nil {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		// Restrict to test users
		if token.Claims["email"].(string) != "darren@tp1.org" {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		c.Next()
	}
}
