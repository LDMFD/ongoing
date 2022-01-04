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

func (s *ApiServer) ListenAndServe() error {
	log.Println("Running Api Server...")

	r := gin.New()
	r.SetTrustedProxies(nil)

	c := cors.New(cors.Options{
		AllowedOrigins:     []string{ "http://ongoing.tp1.org:3000", "http://ongoing.localhost:3000", "http://localhost:3000" },
		AllowedMethods:     []string{"GET", "OPTIONS", "POST", "PUT", "DELETE"},
		AllowedHeaders:     []string{"Authentication", "Content-Type"},

		AllowCredentials:   true,
		OptionsPassthrough: false,

		// Enable Debugging for testing, consider disabling in production
		Debug: true,
	})
	r.Use(c)

	r.Use(AuthMiddleware())

	r.GET("/user", s.getUser)

	r.GET("/clients", s.getClients)
	r.GET("/clients/:ClientId", s.getClient)
	r.POST("/clients", s.createClient)
	r.PUT("/clients/:ClientId", s.updateClient)

	r.POST("/clients/:ClientId/reviews", s.createReview)

	r.GET("/upload", s.requestUpload)
	r.POST("/upload", s.signalUpload)

	r.GET("/download", s.requestDownload)

	r.Run(":8000")

	return nil
}
