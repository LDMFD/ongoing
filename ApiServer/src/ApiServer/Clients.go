package ApiServer

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"ongoing/Models"
	"strings"
)

type GetClientQuery struct {
	ClientId int64 `binding:"required"`
}

func (s *ApiServer) getClient(c *gin.Context) {
	var uri GetClientQuery
	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var client = Models.Client{Id: uri.ClientId}
	if err := s.db.NewSelect().
		Model(&client).
		Relation("Reviews").
		Relation("Reviews.Files").
		WherePK().
		Scan(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Client": client,
	})
}

func (s *ApiServer) getClients(c *gin.Context) {
	var clients []Models.Client
	if err := s.db.NewSelect().Model(&clients).OrderExpr("id ASC").Scan(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Clients": clients,
	})
}

type CreateClientRequest struct {
	Forenames string `binding:"required"`
	Surname string `binding:"required"`
}

func (s *ApiServer) createClient(c *gin.Context) {
	uid := uuid.NewString()
	uid = strings.ReplaceAll(uid, "-", "")

	var req CreateClientRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var client = Models.Client{
		Uid:       uid,
		Forenames: req.Forenames,
		Surname:   req.Surname,
	}
	if _, err := s.db.NewInsert().Model(&client).Exec(c); err != nil {
		panic(err)
	}
	c.JSON(200, gin.H{
		"Client": client,
	})
}

type UpdateClientQuery struct {
	ClientId int64 `binding:"required"`
}

type UpdateClientRequest struct {
	Forenames string `binding:"required"`
	Surname string `binding:"required"`
}

func (s *ApiServer) updateClient(c *gin.Context) {
	var uri UpdateClientQuery
	if err := c.ShouldBindUri(&uri); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var req UpdateClientRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var client = Models.Client{
		Id:        uri.ClientId,
		Forenames: req.Forenames,
		Surname:   req.Surname,
	}
	if _, err := s.db.NewUpdate().Model(&client).WherePK().
		Column("forenames").
		Column("surname").Exec(c); err != nil {
		panic(err)
	}

	c.JSON(200, gin.H{
		"Client": client,
	})
}
