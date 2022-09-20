package AuthService

import (
	"fmt"
	"github.com/pkg/errors"
)

func (c *Client) CreateOrganisation(ownerId, orgId string) error {
	return c.createRelationship("organisation", orgId, "owner", "user", ownerId)
}

// Advisor is logged-in user; client and userId are both created fresh (1 client per advisor enforced by server)
func (c *Client) CreateClient(orgId, advisorId, clientId, userId string) error {
	if err := c.createRelationship("organisation", orgId, "client", "user", userId); err != nil {
		return err
	}
	if err := c.createRelationship("client", clientId, "org", "organisation", orgId); err != nil {
		return err
	}
	if err := c.createRelationship("client", clientId, "advisor", "user", advisorId); err != nil {
		return err
	}
	if err := c.createRelationship("client", clientId, "subject", "user", userId); err != nil {
		return err
	}
	return nil
}

func (c *Client) CreateFile(clientId, orgId *string, fileId string) error {
	if clientId == nil && orgId == nil {
		panic("clientId and orgId may not both be nil")
	}
	if clientId != nil {
		if err := c.createRelationship("file", fileId, "client", "client", *clientId); err != nil {
			return err
		}
	}
	if orgId != nil {
		if err := c.createRelationship("file", fileId, "org", "organisation", *orgId); err != nil {
			return err
		}
	}
	return nil
}

func (c *Client) CheckFilePermission(fileId, permission, userId string) (bool, error) {
	return c.checkPermission("file", fileId, permission, "user", userId)
}

func (c *Client) CreateAdvisor(orgId, userId, role string) error {
	if err := c.createRelationship("organisation", orgId, role, "user", userId); err != nil {
		return err
	}
	return nil
}

func (c *Client) UpdateAdvisorRole(orgId, userId, newRole string) error {
	var rels []OrgRelationship
	var err error

	if rels, err = c.readRelationships("organisation", orgId, &userId); err != nil {
		return errors.WithStack(err)
	}
	for _, r := range rels {
		if r.Role == newRole {
			//return errors.New("Advisor already has this role.")
			return nil
		}
	}
	if len(rels) > 1 {
		return errors.New("User has multiple roles (this shouldn't happen).")
	}
	if len(rels) == 0 {
		return errors.New(fmt.Sprintf("Auth: user %v not found.", userId))
	}
	oldRole := rels[0].Role

	if err := c.mutateRelationship("organisation", orgId, oldRole, "user", userId, newRole); err != nil {
		return err
	}
	return nil
}

func (c *Client) CheckOrgPermission(orgId, permission, clientId string) (bool, error) {
	return c.checkPermission("organisation", orgId, permission, "user", clientId)
}

func (c *Client) LookupOrganisations(userId string) (organisations []string, err error) {
	r, err := c.lookupResource("user", userId, "organisation", "member")
	return r, err
}

type OrgRelationship struct {
	UserId string
	Role   string // TODO enum
}

func (c *Client) ReadOrgRelationships(orgId string, userId *string) (relationships []OrgRelationship, err error) {
	return c.readRelationships("organisation", orgId, userId)
}
