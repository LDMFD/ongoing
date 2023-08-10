package AuthService

import (
	"context"
	"github.com/uptrace/bun"
)

func (c *Client) CreateClientFile(ctx *context.Context, tx *bun.Tx, clientId, orgId string, fileId string) error {
	if err := c.CreateFile(ctx, tx, nil, &orgId, fileId); err != nil {
		return err
	}
	if err := c.CreateFile(ctx, tx, &clientId, nil, fileId); err != nil {
		return err
	}
	return nil
}

func (c *Client) CreateOrgFile(ctx *context.Context, tx *bun.Tx, orgId, fileId string) error {
	if err := c.CreateFile(ctx, tx, nil, &orgId, fileId); err != nil {
		return err
	}
	return nil
}

// Adds a file to the outbox table
func (c *Client) CreateFile(ctx *context.Context, tx *bun.Tx, clientId, orgId *string, fileId string) error {
	if clientId == nil && orgId == nil {
		panic("clientId and orgId may not both be nil")
	}
	if clientId != nil {
		if err := c.createRelationship(ctx, tx, "file", fileId, "client", "client", *clientId); err != nil {
			return err
		}
	}
	if orgId != nil {
		if err := c.createRelationship(ctx, tx, "file", fileId, "org", "organisation", *orgId); err != nil {
			return err
		}
	}
	return nil
}

func (c *Client) RemoveFileFromClient(ctx *context.Context, tx *bun.Tx, clientId, fileId string) error {
	if err := c.removeRelationship(ctx, tx, "file", fileId, "client", "client", clientId); err != nil {
		return err
	}
	return nil
}

func (c *Client) RemoveFileFromOrg(ctx *context.Context, tx *bun.Tx, orgId string, fileId string) error {
	if err := c.removeRelationship(ctx, tx, "file", fileId, "org", "organisation", orgId); err != nil {
		return err
	}
	return nil
}

func (c *Client) RemoveFileFromClientAndOrg(ctx *context.Context, tx *bun.Tx, clientId, orgId, fileId string) error {
	if err := c.removeRelationship(ctx, tx, "file", fileId, "client", "client", clientId); err != nil {
		return err
	}
	if err := c.removeRelationship(ctx, tx, "file", fileId, "org", "organisation", orgId); err != nil {
		return err
	}
	return nil
}

func (c *Client) CheckFilePermission(fileId, permission, userId string) (bool, error) {
	return c.checkPermission("file", fileId, permission, "user", userId)
}

func (c *Client) GetOrgFiles(orgId string) (fileIds []string, err error) {
	return c.lookupResource("organisation", orgId, "file", "org")
}
