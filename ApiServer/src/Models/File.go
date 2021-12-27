package Models

import (
	"github.com/uptrace/bun"
	"time"
)

type File struct {
	bun.BaseModel `bun:"table:files"`

	Id 			int64  		`bun:"id,pk,autoincrement"`
	Uid     	string 		`bun:"uid,notnull"`
	Filename  	string 		`bun:"filename,notnull"`
	Size		int64 		`bin:"size,notnull"`
	ReviewId    int64 		`bun:"review_id,notnull""`
	Timestamp   time.Time	`bun:",nullzero,notnull,default:current_timestamp"`
}
