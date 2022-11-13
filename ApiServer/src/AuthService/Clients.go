package AuthService

// Advisor is logged-in user; client and userId are both created fresh (1 client per advisor enforced by server)
func (c *Client) CreateClient(orgId, advisorId, clientId, userId string) error {
	//log.Printf("create client, org:%v \nadvisor:%v \nclient:%v \nclientUser:%v\n", orgId, advisorId, clientId, userId)

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

func (c *Client) RemoveClient(orgId, advisorId, clientId, clientUserId, advisorUserId string) error {
	//log.Printf("Removing client, org:%v \nadvisor:%v \nclient:%v \nclientUser:%v\n", orgId, advisorId, clientId, clientUserId)

	if err := c.removeRelationship("organisation", orgId, "client", "user", clientUserId); err != nil {
		return err
	} // equivalent to c.RemoveMember(orgId, clientUserId);
	if err := c.removeRelationship("client", clientId, "org", "organisation", orgId); err != nil {
		return err
	}
	if err := c.removeRelationship("client", clientId, "advisor", "user", advisorId); err != nil {
		return err
	}
	if err := c.removeRelationship("client", clientId, "subject", "user", clientUserId); err != nil {
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
