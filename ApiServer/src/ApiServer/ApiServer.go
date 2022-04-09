package ApiServer

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
	"github.com/uptrace/bun"
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
		AllowedOrigins:     []string{
			"https://ongoing.tp1.org",
			"http://localhost.ongoing.tp1.org:3000",
		},
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

	// TODO add timing - see custom middleware example

	r.Use(AddDatabaseMiddleware(s.db))

	AddApiRoutes(r)

	r.Run(":8000")

	return nil
}
