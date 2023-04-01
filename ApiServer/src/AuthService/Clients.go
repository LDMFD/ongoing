package AuthService

import (
	"context"
	"github.com/uptrace/bun"
)

// Advisor is logged-in user; client and userId are both created fresh (1 client per advisor enforced by server)
func (c *Client) CreateClient(ctx *context.Context, tx *bun.Tx, orgId, advisorId, clientId, userId string) error {
	if err := c.createRelationship(ctx, tx, "organisation", orgId, "client", "user", userId); err != nil {
		return err
	}
	if err := c.createRelationship(ctx, tx, "client", clientId, "org", "organisation", orgId); err != nil {
		return err
	}
	if err := c.createRelationship(ctx, tx, "client", clientId, "advisor", "user", advisorId); err != nil {
		return err
	}
	if err := c.createRelationship(ctx, tx, "client", clientId, "subject", "user", userId); err != nil {
		return err
	}
	return nil
}

func (c *Client) RemoveClient(ctx *context.Context, tx *bun.Tx, orgId, advisorId, clientId, clientUserId string) error {
	if err := c.removeRelationship(ctx, tx, "organisation", orgId, "client", "user", clientUserId); err != nil {
		return err
	} // equivalent to c.RemoveMember(orgId, clientUserId);
	if err := c.removeRelationship(ctx, tx, "client", clientId, "org", "organisation", orgId); err != nil {
		return err
	}
	if err := c.removeRelationship(ctx, tx, "client", clientId, "advisor", "user", advisorId); err != nil {
		return err
	}
	if err := c.removeRelationship(ctx, tx, "client", clientId, "subject", "user", clientUserId); err != nil {
		return err
	}
	return nil
}

func (c *Client) GetAdvisor(clientId string, userId *string) (advisorId string, err error) {
	if rels, err := c.readRelationships("client", clientId, nil); err != nil {
		return "", err
	} else {
		for _, rel := range rels {
			if rel.Role == "advisor" {
				return rel.UserId, nil
			}
		}
	}
	return "", nil
}
