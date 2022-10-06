package ApiServer

import (
	"net/http"
	"ongoing/AuthService"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
	"github.com/uptrace/bun"
)

type ApiServer struct {
	db         *bun.DB
	server     *http.Server
	authClient *AuthService.Client
}

func New(db *bun.DB, authClient *AuthService.Client) *ApiServer {
	server := &ApiServer{
		db: db,
		server: &http.Server{
			Addr:         os.Getenv("ONGOING_API_HOST"),
			WriteTimeout: 15 * time.Second,
			ReadTimeout:  15 * time.Second,
		},
		authClient: authClient,
	}
	return server
}

func AddDatabaseMiddleware(db *bun.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("DATABASE", db)
		c.Next()
	}
}

func AddAuthBackendMiddleware(authClient *AuthService.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("AUTH", authClient)
		c.Next()
	}
}

func (s *ApiServer) BuildRouter() (*gin.Engine, error) {
	r := gin.New()
	r.SetTrustedProxies(nil)

	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"https://portal.amplifa.co.uk", // TODO put into configuration
			"https://staging.amplifa.co.uk",
			"http://localhost.ongoing.tp1.org:3000",
		},
		AllowedMethods: []string{"GET", "OPTIONS", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Authentication", "Content-Type", "X-ViewAs"},

		AllowCredentials:   true,
		OptionsPassthrough: false,

		// Enable Debugging for testing, TODO consider disabling in production to reduce log noise?
		Debug: false, // keep as false - enable via new env var - !Tests.TEST_BUILD,
	})
	r.Use(c)

	r.Use(gin.ErrorLogger()) // TODO when to use `r.Use(gin.Logger())` ?

	r.Use(gin.Recovery())

	// TODO add timing - see custom middleware example

	r.Use(AddDatabaseMiddleware(s.db))
	r.Use(AddAuthBackendMiddleware(s.authClient))

	AddApiRoutes(r)

	return r, nil
}
