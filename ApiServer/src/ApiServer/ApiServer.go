package ApiServer

import (
	sentrygin "github.com/getsentry/sentry-go/gin"
	"net/http"
	"ongoing/AuthService"
	"ongoing/ServiceContext"
	"ongoing/Utils/UUID"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
	"github.com/uptrace/bun"
)

var Release string

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

func AddContextMiddleware(db *bun.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		trace := UUID.GenerateUID(nil)[:6]
		context := &ServiceContext.Context{
			Db: db,
			Response: ServiceContext.Response{
				FrameworkContext: c,
				Trace:            &trace,
			},
		}
		c.Set("CONTEXT", context)
		c.Next()
	}
}

// TODO remove
func AddDatabaseContext(db *bun.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("DATABASE", db)
		if context, exists := c.Get("CONTEXT"); !exists {
			panic("Context not set")
		} else {
			context.(*ServiceContext.Context).Db = db
		}
		c.Next()
	}
}

func AddAuthBackendContext(authClient *AuthService.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("AUTH", authClient) // TODO remove
		if context, exists := c.Get("CONTEXT"); !exists {
			panic("Context not set")
		} else {
			context.(*ServiceContext.Context).Auth = authClient
		}
		c.Next()
	}
}

func (s *ApiServer) BuildRouter() (*gin.Engine, error) {
	r := gin.New()

	s.addNetworkConfig(r)

	// TODO add timing - see custom middleware example

	s.addErrorHandling(r)

	s.addServiceContext(r)

	r.Use(AddAuthBackendContext(s.authClient))

	AddRoutes(r)

	return r, nil
}

func (s *ApiServer) addServiceContext(r *gin.Engine) {
	r.Use(AddContextMiddleware(s.db))

	// TODO remove
	r.Use(AddDatabaseContext(s.db))

	r.Use(AddAuthBackendContext(s.authClient))
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
