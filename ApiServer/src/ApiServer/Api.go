package ApiServer

import (
	"log"
	"net/http"
	"ongoing/ApiServer/Clients"
	"ongoing/ApiServer/PolicyProviders"
	"ongoing/ApiServer/PolicyTypes"
	"ongoing/ApiServer/Portfolios"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
	"github.com/uptrace/bun"

	"ongoing/ApiServer/Operators"
)
// TODO https://github.com/gin-gonic/gin#support-lets-encrypt

type ApiServer struct {
	db     *bun.DB
	server *http.Server
}

func New(db *bun.DB) *ApiServer {
	server := &ApiServer{
		db: db,
		server: &http.Server{
			Addr:         os.Getenv("ONGOING_API_HOST"),
			WriteTimeout: 15 * time.Second,
			ReadTimeout:  15 * time.Second,
		},
	}
	return server
}

func AddDatabaseMiddleware(db *bun.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("DATABASE", db)
		c.Next()
	}
}

func (s *ApiServer) ListenAndServe() error {
	log.Println("Running Api Server...")

	r := gin.New()
	r.SetTrustedProxies(nil)

	c := cors.New(cors.Options{
		AllowedOrigins:     []string{ "http://ongoing.tp1.org:3000", "http://localhost:3000" },
		AllowedMethods:     []string{"GET", "OPTIONS", "POST", "PUT", "DELETE"},
		AllowedHeaders:     []string{"Authentication", "Content-Type"},

		AllowCredentials:   true,
		OptionsPassthrough: false,

		// Enable Debugging for testing, TODO consider disabling in production
		Debug: true,
	})
	r.Use(c)

	// Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
	r.Use(gin.Logger())

	// Recover from panics and respond 500
	r.Use(gin.Recovery())

	// Also add timing - see custom middleware example

	r.Use(AddDatabaseMiddleware(s.db))

	r.Use(AuthMiddleware())

	Clients.AddRoutes(r.Group("/clients"))
	Operators.AddRoutes(r.Group("/operators"))
	Portfolios.AddRoutes(r.Group("/portfolios"))
	PolicyTypes.AddRoutes(r.Group("/policy-types"))
	PolicyProviders.AddRoutes(r.Group("/policy-providers"))

	r.GET("/user", s.getUser)
	r.GET("/download", s.requestDownload)
	r.GET("/upload", s.requestUpload)
	r.POST("/upload", s.signalUpload)

	r.Run(":8000")

	return nil
}
