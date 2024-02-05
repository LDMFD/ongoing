package AuthService

import (
	"context"
	"encoding/json"
	pb "github.com/authzed/authzed-go/proto/authzed/api/v1"
	"github.com/authzed/authzed-go/v1"
	"github.com/authzed/grpcutil"
	"github.com/uptrace/bun"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/credentials/insecure"
	"log"
	"ongoing/Operators/Permissions"
	"os"
)

type Client struct {
	Client *authzed.Client
	db     *bun.DB
}

func New(db *bun.DB) *Client {
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
		log.Fatalf("unable to initialize Client: %s", err)
	}

	migrate(context.Background(), client)

	return &Client{
		Client: client,
		db:     db,
	}
}

func migrate(ctx context.Context, client *authzed.Client) {
	// read 'schema' string fromthe file pointed to by env var SPICEDB_SCHEMA_FILE
	filepath := os.Getenv("ONGOING_SPICEDB_SCHEMA")
	if filepath == "" {
		log.Fatalf("SPICEDB_SCHEMA not set")
	}

	schema, err := os.ReadFile(filepath)
	if err != nil {
		log.Fatalf("failed to read schema file: %s", err)
	}

	request := &pb.WriteSchemaRequest{Schema: string(schema)}
	_, err = client.WriteSchema(context.Background(), request)
	if err != nil {
		log.Fatalf("failed to write schema: %s", err)
	}
}

func (c *Client) createRelationship(ctx *context.Context, tx *bun.Tx, objectType, objectId, relation, subjectType, subjectId string) error {
	var err error
	var jobspec []byte
	spec := Permissions.NewRelationshipCommand(CommandCreate, objectType, objectId, relation, subjectType, subjectId, nil)

	if jobspec, err = json.Marshal(spec); err != nil {
		panic(err)
	}

	Schedule(ctx, tx, jobspec)

	return nil
}

func (c *Client) removeRelationship(ctx *context.Context, tx *bun.Tx, objectType, objectId, relation, subjectType, subjectId string) error {
	var err error
	var jobspec []byte
	params := Permissions.NewRelationshipCommand(CommandDelete, objectType, objectId, relation, subjectType, subjectId, nil)

	if jobspec, err = json.Marshal(params); err != nil {
		panic(err)
	}

	Schedule(ctx, tx, jobspec)

	return nil
}

func (c *Client) mutateRelationship(ctx *context.Context, tx *bun.Tx, objectType, objectId, oldRelation, subjectType, subjectId, newRelation string) error {
	var err error
	var jobspec []byte
	params := Permissions.NewRelationshipCommand(CommandMutate, objectType, objectId, oldRelation, subjectType, subjectId, &newRelation)

	if jobspec, err = json.Marshal(params); err != nil {
		panic(err)
	}

	Schedule(ctx, tx, jobspec)

	return nil
}
