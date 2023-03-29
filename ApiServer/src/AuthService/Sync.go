package AuthService

import (
	"context"
	"ongoing/Entities"
	"time"
)

func (c *Client) Sync() error {
	t1 := time.Now()
	for {
		if exists, err := c.db.NewSelect().
			Model((*Entities.Job)(nil)).
			Exists(context.TODO()); err != nil {
			return err
		} else if exists {
			time.Sleep(1 * time.Millisecond)
		} else {
			return nil
		}
		if time.Since(t1) > 5*time.Second {
			panic("timeout waiting for jobs to drain")
		}
	}
}
