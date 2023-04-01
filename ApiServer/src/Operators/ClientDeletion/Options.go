package ClientDeletion

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"ongoing/Entities"
)

func DeleteClientOptions(c *gin.Context, tx *bun.Tx, dbClient *Entities.Client) {
	if _, err := tx.NewDelete().Model((*Entities.ClientOptions)(nil)).
		Where("client_id = ?", dbClient.Id).
		Exec(c); err != nil {
		panic(err.Error())
	}
}
