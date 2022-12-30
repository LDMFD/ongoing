package ApiServer

import (
	sentrygin "github.com/getsentry/sentry-go/gin"
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

	s.addNetworkConfig(r)

	// TODO add timing - see custom middleware example

	s.addErrorHandling(r)

	r.Use(AddDatabaseMiddleware(s.db))

	r.Use(AddAuthBackendMiddleware(s.authClient))

	AddApiRoutes(r)

	return r, nil
}

func (s *ApiServer) addNetworkConfig(r *gin.Engine) {
	r.SetTrustedProxies(nil)

	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"https://portal.amplifa.co.uk", // TODO put into configuration
			"https://staging.amplifa.co.uk",
			"http://localhost.ongoing.tp1.org:3000",
		},
		AllowedMethods: []string{"GET", "OPTIONS", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Authentication", "Content-Type", "Cache-Control", "Content-Disposition", "X-ViewAs"},

		AllowCredentials:   true,
		OptionsPassthrough: false,

		Debug: false, // Debug CORS issues
	})
	r.Use(c)
}

func (s *ApiServer) addErrorHandling(r *gin.Engine) {
	// Send 500 on panic
	r.Use(gin.Recovery())

	r.Use(gin.ErrorLogger())

	dsn := os.Getenv("ONGOING_SENTRY_DSN")
	if dsn != "" {
		r.Use(sentrygin.New(sentrygin.Options{
			Repanic: true,
		}))
	}
}
