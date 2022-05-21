package Entities

import (
	"time"

	"github.com/uptrace/bun"
)

type RiskAssessment struct {
	bun.BaseModel `bun:"table:risk_assessments"`

	Id                  int64     `bun:"id,pk,autoincrement"`
	Uid                 string    `bun:"uid,notnull"`
	ClientId            int64     `bun:"client_id,notnull"`
	RiskLevelId         int64     `bun:"risk_level_id,notnull"`
	QuestionnaireFileId *int64    `bun:"questionnaire_file_id"`
	Completed           time.Time `bun:",nullzero,notnull"`
	Timestamp           time.Time `bun:",nullzero,notnull,default:current_timestamp"`

	Client        *Client    `bun:"rel:has-one,join:client_id=id"`
	RiskLevel     *RiskLevel `bun:"rel:has-one,join:risk_level_id=id"`
	Questionnaire *File      `bun:"rel:has-one,join:questionnaire_file_id=id"`
}

type ReportRiskAssessment struct {
	Id             string
	RiskProviderId string
	RiskLevelId    string
	Completed      string
	Questionnaire  struct {
		Uid      string
		Filename string
	}
}

func (a *RiskAssessment) ToReport() ReportRiskAssessment {
	report := ReportRiskAssessment{
		Id:             a.Uid,
		RiskProviderId: a.RiskLevel.RiskProvider.Uid,
		RiskLevelId:    a.RiskLevel.Uid,
		Completed:      a.Completed.Format("2006-01-02"),
	}
	if a.Questionnaire != nil {
		report.Questionnaire = ReportFile{
			Uid:      a.Questionnaire.Uid,
			Filename: a.Questionnaire.Filename,
		}
	}
	return report
}
