package AuthService

func (c *Client) CreateClientFile(clientId, orgId string, fileId string) error {
	if err := c.CreateFile(nil, &orgId, fileId); err != nil {
		return err
	}
	if err := c.CreateFile(&clientId, nil, fileId); err != nil {
		return err
	}
	return nil
}

func (c *Client) CreateOrgFile(orgId, fileId string) error {
	if err := c.CreateFile(nil, &orgId, fileId); err != nil {
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

func (c *Client) RemoveFileFromClient(clientId, fileId string) error {
	if err := c.removeRelationship("file", fileId, "client", "client", clientId); err != nil {
		return err
	}
	return nil
}

func (c *Client) RemoveFileFromOrg(orgId string, fileId string) error {
	if err := c.removeRelationship("file", fileId, "org", "organisation", orgId); err != nil {
		return err
	}
	return nil
}

func (c *Client) RemoveFileFromClientAndOrg(clientId, orgId string, fileId string) error {
	if err := c.removeRelationship("file", fileId, "client", "client", clientId); err != nil {
		return err
	}
	if err := c.removeRelationship("file", fileId, "org", "organisation", orgId); err != nil {
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
