package ApiServer

import (
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		/*
		var (
			sessionUid 	*http.Cookie
			err 		error
			payload		*idtoken.Payload
		)
		if sessionUid, err = c.Request.Cookie("ONGOING_SESSION"); err == nil {
			log.Println("*** READ COOKIE", sessionUid)
			c.Next()
			return
		}

		token := c.GetHeader("Authentication")

		clientId := os.Getenv("ONGOING_GOOGLE_SSO_CLIENT_ID")
		payload, err = idtoken.Validate(context.Background(), token, clientId)
		if err != nil {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		if payload.Claims["email"].(string) != "darren@tp1.org" {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		uid := uuid.NewString()
		uid = strings.ReplaceAll(uid, "-", "")

		cookie := http.Cookie{
			Name:       "ONGOING_SESSION",
			Value:      uid,
			Path:       "/",
			Domain:     ".api.ongoing.localhost",
			Expires:    time.Now().Add(time.Second * 300),
			MaxAge:     300,
			Secure:     true,
			HttpOnly:   false,
			SameSite:   http.SameSiteNoneMode,
		}
		http.SetCookie(c.Writer, &cookie)
		*/
		c.Next()
	}
}
