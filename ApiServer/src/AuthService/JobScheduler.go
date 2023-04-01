package AuthService

import (
	"context"
	"github.com/uptrace/bun"
	"ongoing/Entities"
	"ongoing/Utils/UUID"
	"time"
)

func Schedule(c *context.Context, tx *bun.Tx, jobspec []byte) string {
	cmd := Entities.Job{
		Uid:       UUID.GenerateUID(nil),
		Jobspec:   string(jobspec),
		Timestamp: time.Time{},
	}
	if _, err := tx.NewInsert().
		Model(&cmd).
		Exec(*c); err != nil {
		panic(err)
	}

	if _, err := tx.ExecContext(*c, "NOTIFY ?, ?", bun.Ident(Channel), ""); err != nil {
		panic(err)
	}

	return cmd.Uid
}
