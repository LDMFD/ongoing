package ApiServer

import (
	"context"
	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"google.golang.org/api/option"
	"log"
	"net/http"
	"ongoing/AuthService"
	"ongoing/Entities"
	"os"
	"strings"
)

func AuthMiddleware(roleFilter *[]string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if roleFilter == nil {
			c.Next()
			return
		}

		var (
			app    *firebase.App
			client *auth.Client
			token  *auth.Token
			err    error
		)
		db := c.MustGet("DATABASE").(*bun.DB)
		authClient := c.MustGet("AUTH").(*AuthService.Client)

		jwt := c.GetHeader("Authentication")

		// Validate it's a real identity (has gone through Firebase login)
		var email string
		if os.Getenv("OFFLINE_AUTH") == "true" {
			email = jwt
		} else {
			opt := option.WithCredentialsFile(os.Getenv("FIREBASE_CONFIG"))
			if app, err = firebase.NewApp(context.Background(), nil, opt); err != nil {
				panic(err)
			}
			if client, err = app.Auth(context.Background()); err != nil {
				panic(err)
			}

			// Check valid Google token
			if token, err = client.VerifyIDToken(context.Background(), jwt); err != nil {
				log.Println("Token verification failed:", err)
				c.AbortWithStatus(http.StatusForbidden)
				return
			}

			email = token.Claims["email"].(string)
		}

		var user *Entities.User

		// Validate it's a known identity
		var users []Entities.User
		count, err := db.NewSelect().Model(&users).
			Where("email = ?", email).
			ScanAndCount(c)
		if err != nil {
			log.Println(err)
			log.Println("Unauthorized access attempt by:", email)
			c.AbortWithStatus(http.StatusForbidden)
			return
		} else if count == 1 {
			user = &users[0]
		} else {
			if c.GetHeader("X-Ongoing-ExpectForbidden") != "true" {
			log.Println("Unauthorized access attempt by:", email)
			}
			c.AbortWithStatus(http.StatusForbidden) // no users found with matching email
			return
		}

		if !user.Verified {
			user.Verified = true
			if _, err := db.NewUpdate().Model(user).Where("Id = ?", user.Id).
				Column("verified").
				Exec(c); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				panic(err.Error())
			}
		}

		var role string
		var orgId *string

		viewAsId := c.GetHeader("X-ViewAs")
		if IsSuperuser(user.Email) && viewAsId != "" && viewAsId != "null" {
			var subject Entities.User
			if err = db.NewSelect().Model(&subject).Where("uid = ?", viewAsId).Scan(c); err != nil {
				c.AbortWithStatus(http.StatusBadRequest)
				panic(err.Error())
			}
			user = &subject
			log.Println("Viewing as:", user.Email)
		}

		// Look up user's role
		if IsSuperuser(user.Email) {
			role = Entities.UserTypeSuperuser
		} else {
			if orgs, err := authClient.LookupOrganisations(user.Uid); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				log.Printf("%+v", err)
				return
			} else {
				// Only 1 organisation allowed for now
				if orgs == nil || len(orgs) == 0 {
					c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
					return
				}
				orgId = &orgs[0]
			}

			if relationships, err := authClient.ReadOrgRelationships(*orgId, &user.Uid); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				log.Printf("%+v", err)
				return
			} else {
				role = relationships[0].Role // TODO allow membership in multiple orgs
			}
		}

		// Check the role passes the filter
		if roleFilter != nil && len(*roleFilter) > 0 {
			found := false
			for _, rf := range *roleFilter {
				if rf == role {
					found = true
					break
				}
			}
			if !found {
				if os.Getenv("OFFLINE_TESTS") != "true" {
					if c.GetHeader("X-Ongoing-ExpectForbidden") != "true" {
						log.Printf("Unauthorized access attempt: user=%s path=%s\n", email, c.Request.URL.Path)
					}
				}
				c.AbortWithStatus(http.StatusForbidden)
				return
			}
		}

		sessionContext := &Entities.ServerSessionContext{
			UserId:  user.Id,
			UserUid: user.Uid,
			Email:   user.Email,
			OrgId:   orgId,
			Role:    role,
		}

		if orgId != nil { // no org if superuser
			var org = Entities.Organisation{}
			if err := db.NewSelect().
				Model(&org).
				Where("uid = ?", orgId).
				Scan(c); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				log.Printf("%+v", err)
				return
			}
			sessionContext.Org = &org
		}

		c.Set("SESSION", sessionContext)
		c.Next()
	}
}

func IsSuperuser(email string) bool {
	superusers := os.Getenv("ONGOING_SUPERUSERS")
	for _, su := range strings.Split(superusers, ",") {
		su = strings.TrimSpace(su)
		if email == su {
			return true
		}
	}
	return false
}
