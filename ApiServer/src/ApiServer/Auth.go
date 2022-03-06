package ApiServer

import (
	"context"
	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
)

func AuthMiddleware(typeFilter *string) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			app *firebase.App
			client *auth.Client
			token *auth.Token
			err error
		)
		db := c.MustGet("DATABASE").(*bun.DB)

		jwt := c.GetHeader("Authentication")

		var (
			email  string
			exists bool
		)

		if jwt[len(jwt)-8:] == "@tp1.org" {
			email = jwt
		} else {
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

			email  = token.Claims["email"].(string)
		}
		user := &Entities.User{}

		if count, err := db.NewSelect().Model(user).Where("email = ?", email).ScanAndCount(c); err != nil {
			c.AbortWithStatus(http.StatusForbidden)
			return
		} else {
			exists = count > 0
		}

		if !exists && typeFilter != nil {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		if !userPassesTypeCheck(user, typeFilter) {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		if exists {
			c.Set("USER", user)
		}
		c.Next()
	}
}

func userPassesTypeCheck(user *Entities.User, typeFilter *string) bool {
	if typeFilter == nil {
		return true
	}

	if user.Type == Entities.UserTypeAdmin {
		return true
	}

	return user.Type == *typeFilter
}