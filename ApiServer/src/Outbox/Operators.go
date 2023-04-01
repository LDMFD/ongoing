package Outbox

import (
	"context"
	pb "github.com/authzed/authzed-go/proto/authzed/api/v1"
)

func (o *Outbox) CreateRelationship(objectType, objectId, relation, subjectType, subjectId string) error {
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

	_, err := o.auth.Client.WriteRelationships(context.TODO(), request)
	if err != nil {
		return err
		//return errors.WithStack(err)
	}
	return nil
}

func (o *Outbox) removeRelationship(objectType, objectId, relation, subjectType, subjectId string) error {
	request := &pb.WriteRelationshipsRequest{
		Updates: []*pb.RelationshipUpdate{
			{
				Operation: pb.RelationshipUpdate_OPERATION_DELETE,
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

	_, err := o.auth.Client.WriteRelationships(context.Background(), request)
	if err != nil {
		panic(err)
		//return errors.WithStack(err)
	}
	return nil
}

func (o *Outbox) mutateRelationship(objectType, objectId, oldRelation, subjectType, subjectId, newRelation string) error {
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

	_, err := o.auth.Client.WriteRelationships(context.Background(), request)
	if err != nil {
		panic(err)
		//return errors.WithStack(err)
	}
	return nil
}
