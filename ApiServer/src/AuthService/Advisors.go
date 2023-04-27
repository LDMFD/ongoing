package AuthService

import (
	"context"
	"fmt"
	"github.com/pkg/errors"
	"github.com/uptrace/bun"
)

func (c *Client) CreateAdvisor(ctx *context.Context, tx *bun.Tx, orgId, userId, role string) error {
	if err := c.createRelationship(ctx, tx, "organisation", orgId, role, "user", userId); err != nil {
		return err
	}
	return nil
}

func (c *Client) UpdateAdvisorRole(ctx *context.Context, tx *bun.Tx, orgId, userId, newRole string) (err error) {
	var oldRole string
	if oldRole, err = c.getRole(orgId, userId); err != nil {
		return err
	}

	if oldRole == newRole {
		return nil
	}

	if err := c.mutateRelationship(ctx, tx, "organisation", orgId, oldRole, "user", userId, newRole); err != nil {
		return err
	}
	return nil
}

func (c *Client) getRole(orgId string, userId string) (string, error) {
	var rels []OrgRelationship
	var err error

	if rels, err = c.readRelationships("organisation", orgId, &userId); err != nil {
		return "", errors.WithStack(err)
	}
	if len(rels) > 1 {
		return "", errors.New("User has multiple roles (this shouldn't happen).")
	}
	if len(rels) == 0 {
		return "", errors.New(fmt.Sprintf("Auth: user %v not found.", userId))
	}
	oldRole := rels[0].Role
	return oldRole, nil
}

func (c *Client) RemoveMember(ctx *context.Context, tx *bun.Tx, orgId, userId string) (err error) {
	var role string
	if role, err = c.getRole(orgId, userId); err != nil {
		return err
	}

	cccc := context.TODO()
	if err := c.removeRelationship(&cccc, tx, "organisation", orgId, role, "user", userId); err != nil {
		return err
	}
	return nil
}
