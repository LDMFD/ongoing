package AuthService

import (
	"context"
	pb "github.com/authzed/authzed-go/proto/authzed/api/v1"
	"github.com/pkg/errors"
	"io"
)

func (c *Client) readRelationships(resourceType, resourceId string, userId *string) (relationships []OrgRelationship, err error) {
	rf := &pb.RelationshipFilter{
		ResourceType:       resourceType,
		OptionalResourceId: resourceId,
		//OptionalRelation:      "",
	}
	if userId != nil {
		rf.OptionalSubjectFilter = &pb.SubjectFilter{
			SubjectType:       "user",
			OptionalSubjectId: *userId,
			//OptionalRelation:  nil,
		}
	}

	request := &pb.ReadRelationshipsRequest{
		Consistency: &pb.Consistency{
			Requirement: &pb.Consistency_FullyConsistent{
				FullyConsistent: true, // For the tests to pass
			},
		},
		RelationshipFilter: rf,
	}

	stream, err := c.Client.ReadRelationships(context.Background(), request)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	for {
		resource, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, errors.WithStack(err)
		}
		relationships = append(relationships, OrgRelationship{
			UserId: resource.Relationship.Subject.Object.ObjectId,
			Role:   resource.Relationship.Relation,
		})
	}
	return relationships, nil
}

func (c *Client) checkPermission(resourceType, resourceId, permission, subjectType, subjectId string) (bool, error) {
	request := &pb.CheckPermissionRequest{
		Resource: &pb.ObjectReference{
			ObjectType: resourceType,
			ObjectId:   resourceId,
		},
		Permission: permission,
		Subject: &pb.SubjectReference{
			Object: &pb.ObjectReference{
				ObjectType: subjectType,
				ObjectId:   subjectId,
			},
		},
		Consistency: &pb.Consistency{
			Requirement: &pb.Consistency_FullyConsistent{
				FullyConsistent: true,
			},
		},
	}

	resp, err := c.Client.CheckPermission(context.Background(), request)
	if err != nil {
		return false, errors.WithStack(err)
	}
	return resp.Permissionship == pb.CheckPermissionResponse_PERMISSIONSHIP_HAS_PERMISSION, nil
}

func (c *Client) lookupResource(subjectType, subjectId, resourceType, permission string) (resources []string, err error) {
	subject := &pb.SubjectReference{Object: &pb.ObjectReference{
		ObjectType: subjectType,
		ObjectId:   subjectId,
	}}

	request := &pb.LookupResourcesRequest{
		ResourceObjectType: resourceType,
		Permission:         permission,
		Subject:            subject,
		Consistency: &pb.Consistency{
			Requirement: &pb.Consistency_FullyConsistent{
				FullyConsistent: true,
			},
		},
	}

	stream, err := c.Client.LookupResources(context.Background(), request)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	for {
		resource, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, errors.WithStack(err)
		}
		resources = append(resources, resource.ResourceObjectId)
	}
	return resources, nil // cannot be nil
}

func (c *Client) lookupSubjects(subjectType, subjectId, resourceType, permission string) (resources []string, err error) {
	resource := &pb.ObjectReference{
		ObjectType: subjectType,
		ObjectId:   subjectId,
	}

	request := &pb.LookupSubjectsRequest{
		Consistency: &pb.Consistency{
			Requirement: &pb.Consistency_FullyConsistent{
				FullyConsistent: true,
			},
		},
		Resource:          resource,
		Permission:        permission,
		SubjectObjectType: resourceType,
		//OptionalSubjectRelation: "",
	}

	stream, err := c.Client.LookupSubjects(context.Background(), request)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	for {
		resource, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, errors.WithStack(err)
		}
		resources = append(resources, resource.SubjectObjectId)
	}
	return resources, nil
}

func (c *Client) ReadSchema() (*string, error) {
	request := &pb.ReadSchemaRequest{}

	response, err := c.Client.ReadSchema(context.TODO(), request)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return &response.SchemaText, nil
}
