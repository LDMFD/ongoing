package AuthService

import (
	"fmt"
	"github.com/pkg/errors"
)

func (c *Client) CreateAdvisor(orgId, userId, role string) error {
	if err := c.createRelationship("organisation", orgId, role, "user", userId); err != nil {
		return err
	}
	return nil
}

func (c *Client) UpdateAdvisorRole(orgId, userId, newRole string) (err error) {
	var oldRole string
	if oldRole, err = c.getRole(orgId, userId); err != nil {
		return err
	}

	if oldRole == newRole {
		return nil
	}

	if err := c.mutateRelationship("organisation", orgId, oldRole, "user", userId, newRole); err != nil {
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

func (c *Client) RemoveMember(orgId, userId string) (err error) {
	var role string
	if role, err = c.getRole(orgId, userId); err != nil {
		return err
	}

	if err := c.removeRelationship("organisation", orgId, role, "user", userId); err != nil {
		return err
	}
	return nil
}
