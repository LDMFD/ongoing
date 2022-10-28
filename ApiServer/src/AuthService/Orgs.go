package AuthService

import (
	"github.com/pkg/errors"
)

func (c *Client) CreateOrganisation(ownerId, orgId string) error {
	return c.createRelationship("organisation", orgId, "owner", "user", ownerId)
}

func (c *Client) CheckOrgPermission(orgId, permission, clientId string) (bool, error) {
	return c.checkPermission("organisation", orgId, permission, "user", clientId)
}

func (c *Client) LookupOrganisations(userId string) (organisations []string, err error) {
	r, err := c.lookupResource("user", userId, "organisation", "member")
	return r, err
}

func (c *Client) LookupUsers(orgId string) (users []string, err error) {
	r, err := c.lookupSubjects("organisation", orgId, "user", "member")
	return r, err
}

func (c *Client) LookupOrganisationOwner(orgId string) (ownerId *string, err error) {
	if orgs, err := c.lookupSubjects("organisation", orgId, "user", "owner"); err != nil {
		return nil, err
	} else {
		if len(orgs) != 1 {
			return nil, errors.New("org has multiple owners")
		}
		return &orgs[0], nil
	}
}

type OrgRelationship struct {
	UserId string
	Role   string // TODO enum
}

func (c *Client) ReadOrgRelationships(orgId string, userId *string) (relationships []OrgRelationship, err error) {
	return c.readRelationships("organisation", orgId, userId)
}
