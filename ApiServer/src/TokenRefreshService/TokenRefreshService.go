package TokenRefreshService

//import (
//	"context"
//	"github.com/uptrace/bun"
//	"log"
//	"ongoing/AuthService"
//	"ongoing/Entities"
//	"time"
//)
//
//type TokenRefreshService struct {
//	db  *bun.DB
//	ctx context.Context
//}
//
//func New(db *bun.DB, authClient *AuthService.Client) *TokenRefreshService {
//	outbox := &TokenRefreshService{
//		db:  db,
//		ctx: context.Background(),
//	}
//	return outbox
//}
//
//func (trs *TokenRefreshService) RunTokenRefreshService() {
//	for {
//		trs.run()
//		time.Sleep(time.Minute)
//	}
//}
//
//func (trs *TokenRefreshService) run() {
//	defer func() {
//		if r := recover(); r != nil {
//			log.Println("Recovered in token refresh service", r)
//		}
//	}()
//
//	if err := trs.db.RunInTx(trs.ctx, nil, func(ctx context.Context, tx bun.Tx) error {
//		if _, err := tx.ExecContext(ctx, "SELECT pg_advisory_xact_lock(?)", AuthService.AdvisoryLockTokenRefresh); err != nil {
//			panic(err)
//		}
//
//		var sessions []Entities.OAuthSession
//		if err := tx.NewSelect().
//			Model(&sessions).
//			OrderExpr("id ASC").
//			Scan(trs.ctx); err != nil {
//			panic(err)
//		}
//
//		for _, session := range sessions {
//			trs.process(session)
//		}
//		return nil
//	}); err != nil {
//		panic(err)
//	}
//}
//
//func (trs *TokenRefreshService) process(session Entities.OAuthSession) {
//	if time.Now().After(session.Expiry.Add(-time.Minute * 5)) {
//
//	}
//}
