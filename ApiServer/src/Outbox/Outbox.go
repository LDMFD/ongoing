package Outbox

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/driver/pgdriver"
	"log"
	"ongoing/AuthService"
	"ongoing/Entities"
	"ongoing/Operators/Permissions"
)

type Outbox struct {
	db   *bun.DB
	auth *AuthService.Client
	ctx  context.Context
}

func New(db *bun.DB, authClient *AuthService.Client) *Outbox {
	outbox := &Outbox{
		db:   db,
		auth: authClient,
		ctx:  context.Background(),
	}
	return outbox
}

func (o *Outbox) RunOutbox() {
	channel := pgdriver.NewListener(o.db)
	if err := channel.Listen(o.ctx, AuthService.Channel); err != nil {
		panic(err)
	}

	o.drainJobs()

	for range channel.Channel() {
		o.drainJobs()
	}
}

func (o *Outbox) drainJobs() {
	defer func() {
		if r := recover(); r != nil {
			log.Println("Recovered in outbox", r)
		}
	}()

	if err := o.db.RunInTx(o.ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		if _, err := tx.ExecContext(ctx, "SELECT pg_advisory_xact_lock(?)", AuthService.AdvisoryLockOutbox); err != nil {
			panic(err)
		}

		var jobs []Entities.Job
		if err := tx.NewSelect().
			Model(&jobs).
			OrderExpr("id ASC").
			Scan(o.ctx); err != nil {
			panic(err)
		}

		for _, job := range jobs {
			o.process(job)

			if _, err := tx.NewDelete().
				Model(&job).
				WherePK().
				Exec(o.ctx); err != nil {
				panic(err)
			}
		}
		return nil
	}); err != nil {
		panic(err)
	}
}

func (o *Outbox) process(job Entities.Job) {
	jobspec := &Permissions.Jobspec{}
	if err := json.Unmarshal(bytes.NewBufferString(job.Jobspec).Bytes(), jobspec); err != nil {
		panic(err.Error())
	}

	switch jobspec.Command {
	case AuthService.CommandCreate:
		if err := o.CreateRelationship(jobspec.ObjectType, jobspec.ObjectId, jobspec.Relation, jobspec.SubjectType, jobspec.SubjectId); err != nil {
			panic(err)
		}
		break
	case AuthService.CommandDelete:
		if err := o.removeRelationship(jobspec.ObjectType, jobspec.ObjectId, jobspec.Relation, jobspec.SubjectType, jobspec.SubjectId); err != nil {
			panic(err)
		}
		break
	case AuthService.CommandMutate:
		if err := o.mutateRelationship(jobspec.ObjectType, jobspec.ObjectId, jobspec.Relation, jobspec.SubjectType, jobspec.SubjectId, jobspec.NewRelation); err != nil {
			panic(err)
		}
		break
	case AuthService.CommandHealthcheck:
		log.Println("Outbox healthcheck, job id: ", job.Uid)
		break
	default:
		panic("Unknown command")
	}
}
