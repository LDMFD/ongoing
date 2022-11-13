package AuthService

import (
	"context"
	pb "github.com/authzed/authzed-go/proto/authzed/api/v1"
	"github.com/authzed/authzed-go/v1"
	"github.com/authzed/grpcutil"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/credentials/insecure"
	"io"
	"log"
	"os"
)

type Client struct {
	client *authzed.Client
}

func New() *Client {
	addr := os.Getenv("ONGOING_SPICEDB_HOST")
	psk := os.Getenv("ONGOING_SPICEDB_PSK")

	var creds, token grpc.DialOption

	if os.Getenv("ONGOING_SPICEDB_INSECURE") == "true" {
		creds = grpc.WithTransportCredentials(insecure.NewCredentials())
		token = grpcutil.WithInsecureBearerToken(psk)
	} else {
		creds = grpc.WithTransportCredentials(credentials.NewClientTLSFromCert(nil, ""))
		token = grpcutil.WithBearerToken(psk)
	}

	client, err := authzed.NewClient(addr, creds, token)
	if err != nil {
		log.Fatalf("unable to initialize client: %s", err)
	}

	return &Client{
		client: client,
	}
}

func (c *Client) createRelationship(objectType, objectId, relation, subjectType, subjectId string) error {
	request := &pb.WriteRelationshipsRequest{
		Updates: []*pb.RelationshipUpdate{
			{
				Operation: pb.RelationshipUpdate_OPERATION_TOUCH,
				Relationship: &pb.Relationship{
					Resource: &pb.ObjectReference{
						ObjectType: objectType,
						ObjectId:   objectId,
					},
					Relation: relation,
					Subject: &pb.SubjectReference{
						Object: &pb.ObjectReference{
							ObjectType: subjectType,
							ObjectId:   subjectId,
						},
					},
				},
			},
		},
	}

	_, err := c.client.WriteRelationships(context.Background(), request)
	if err != nil {
		return errors.WithStack(err)
	}
	return nil
}

func (c *Client) mutateRelationship(objectType, objectId, oldRelation, subjectType, subjectId, newRelation string) error {
	request := &pb.WriteRelationshipsRequest{
		Updates: []*pb.RelationshipUpdate{
			{
				Operation: pb.RelationshipUpdate_OPERATION_DELETE,
				Relationship: &pb.Relationship{
					Resource: &pb.ObjectReference{
						ObjectType: objectType,
						ObjectId:   objectId,
					},
					Relation: oldRelation,
					Subject: &pb.SubjectReference{
						Object: &pb.ObjectReference{
							ObjectType: subjectType,
							ObjectId:   subjectId,
						},
					},
				},
			},
			{
				Operation: pb.RelationshipUpdate_OPERATION_CREATE,
				Relationship: &pb.Relationship{
					Resource: &pb.ObjectReference{
						ObjectType: objectType,
						ObjectId:   objectId,
					},
					Relation: newRelation,
					Subject: &pb.SubjectReference{
						Object: &pb.ObjectReference{
							ObjectType: subjectType,
							ObjectId:   subjectId,
						},
					},
				},
			},
		},
	}

	_, err := c.client.WriteRelationships(context.Background(), request)
	if err != nil {
		return errors.WithStack(err)
	}
	return nil
}

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

	stream, err := c.client.ReadRelationships(context.Background(), request)
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

	resp, err := c.client.CheckPermission(context.Background(), request)
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

	stream, err := c.client.LookupResources(context.Background(), request)
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
	return resources, nil
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

	stream, err := c.client.LookupSubjects(context.Background(), request)
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

	response, err := c.client.ReadSchema(context.TODO(), request)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	return &response.SchemaText, nil
}

func (c *Client) GetOrgFiles(orgId string) (fileIds []string, err error) {
	return c.lookupResource("organisation", orgId, "file", "org")
}
