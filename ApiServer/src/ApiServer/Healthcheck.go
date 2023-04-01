package ApiServer

import (
	"database/sql"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Storage/Commands"
	"ongoing/AuthService"
	"ongoing/Entities"
	"ongoing/Operators/Permissions"
	"ongoing/ServiceContext"
)

func healthcheck(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db

	// Test DB connection
	_, err := db.Exec("SELECT 1")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "database connection"})
		return
	}

	// Test storage key generation (doesn't test upload)
	Commands.GenerateSignedGetUrl("test")

	// Test SpiceDB
	schema, err := context.Auth.ReadSchema()
	if err != nil {
		log.Println(err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "auth server down"})
		return
	}
	if schema == nil || len(*schema) == 0 {
		log.Println("no schema")
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "auth server not initialized"})
		return
	}

	// Test outbox
	var jobId string
	ctx := c.Request.Context()

	tx, err := context.Db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Panic(err)
	}
	defer tx.Rollback()

	spec := &Permissions.Jobspec{
		Command: AuthService.CommandHealthcheck,
	}
	if jobspec, err := json.Marshal(spec); err != nil {
		panic(err)
	} else {
		jobId = AuthService.Schedule(&ctx, &tx, jobspec)
	}

	if err := tx.Commit(); err != nil {
		context.Panic(err)
	}

	var jobs []Entities.Job
	var count int
	if count, err = db.NewSelect().
		Model(&jobs).
		OrderExpr("id ASC").
		ScanAndCount(ctx); err != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, gin.H{
		"Version": Release,
		"JobId":   jobId,
		"Jobs":    count,
	})
}

func errorcheck(c *gin.Context) {
	context := c.MustGet("CONTEXT").(*ServiceContext.Context)
	db := context.Db

	_, err := db.Exec("MISTAKE")
	if err != nil {
		context.Panic(err)
	}
}
