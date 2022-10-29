package Entities

import (
	"ongoing/Utils/Date"
	"time"

	"github.com/uptrace/bun"
)

type RiskAssessment struct {
	bun.BaseModel `bun:"table:risk_assessments"`

	Id          int64     `bun:"id,pk,autoincrement"`
	Uid         string    `bun:"uid,notnull"`
	ClientId    int64     `bun:"client_id,notnull"`
	RiskLevelId int64     `bun:"risk_level_id,notnull"`
	FilePtrId   *int64    `bun:"file_ptr_id"`
	Completed   time.Time `bun:",nullzero,notnull"`
	Timestamp   time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Client    *Client    `bun:"rel:has-one,join:client_id=id"`
	RiskLevel *RiskLevel `bun:"rel:has-one,join:risk_level_id=id"`
	FilePtr   *FilePtr   `bun:"rel:has-one,join:file_ptr_id=id"`
}

type ReportRiskAssessment struct {
	Id             string
	RiskProviderId string
	RiskLevelId    string
	Completed      string
	File           *ReportFile
}

func (a *RiskAssessment) ToReport() ReportRiskAssessment {
	report := ReportRiskAssessment{
		Id:             a.Uid,
		RiskProviderId: a.RiskLevel.RiskProvider.Uid,
		RiskLevelId:    a.RiskLevel.Uid,
		Completed:      Date.ToCanonical(&a.Completed),
	}
	if a.FilePtr != nil {
		report.File = a.FilePtr.ToReport()
	}
	return report
}
