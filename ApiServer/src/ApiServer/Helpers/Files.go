package Helpers

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
	"ongoing/Utils/UUID"
)

func CreateFileRef(c *gin.Context, tx bun.Tx, file *Entities.RequestFile) *int64 {
	var fileId *int64
	if file != nil && file.Uid != "" {
		var existing Entities.File
		if count, err := tx.NewSelect().Model(&existing).Where("uid = ?", file.Uid).ScanAndCount(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		} else if count == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "FilePtr not found"})
			panic(err.Error())
		}
		fileId = &existing.Id
	}

	filePtrUid := UUID.GenerateUID(c)

	var filePtr = Entities.FilePtr{
		Uid:    filePtrUid,
		FileId: fileId,
	}

	if _, err := tx.NewInsert().
		Model(&filePtr). //Returning("Id"). // not working
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	} //if filePtrId, err := res.LastInsertId(); err != nil {

	if err := tx.NewSelect().
		Model(&filePtr).
		Where("uid = ?", filePtrUid).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		_ = tx.Rollback()
		panic(err.Error())
	}
	return &filePtr.Id
}

func DeleteFile(c *gin.Context, tx bun.Tx, filePtr Entities.FilePtr) {
	if _, err := tx.NewDelete().
		Model(&filePtr).
		WherePK().
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var filePtrs []Entities.FilePtr
	if err := tx.NewSelect().
		Model(&filePtrs).
		Where("file_id = ?", filePtr.FileId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	if len(filePtrs) == 0 {
		if _, err := tx.NewDelete().
			Model(filePtr.File).
			WherePK().
			Exec(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		}
	}
}
