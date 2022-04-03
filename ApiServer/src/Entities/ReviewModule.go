package Entities

import (
	"github.com/uptrace/bun"
)

// This list also found in 0.sql and ModuleTypes.js
var (
    ModuleTypeIntroduction       = "introduction"

    ModuleTypeProfile            = "profile"
    ModuleTypeFactFind           = "profile:fact-find"
    ModuleTypeRisk               = "profile:risk"
    ModuleTypeObjectives         = "profile:objectives"

    ModuleTypePolicyValuations   = "policy-valuations"
    ModuleTypeValuation          = "policy-valuations:valuation"
    ModuleTypeContributions      = "policy-valuations:contributions"

    ModuleTypeFees               = "fees"
    ModuleTypeAdviceFee          = "fees:advice-fee"
    ModuleTypePolicyFees         = "fees:policy-fees"
    ModuleTypeFundLevelFees      = "fees:fund-level"
    ModuleTypePortfolioLevelFees = "fees:portfolio-level"
    ModuleTypeDimFee             = "fees:dim"

    ModuleTypeConclusions        = "conclusions"
    ModuleTypeAdviceGiven        = "conclusions:advice-given"
    ModuleTypeDueDiligence       = "conclusions:due-diligence"
    ModuleTypeOngoingSuitability = "conclusions:ongoing-suitability"
    ModuleTypeActionPoints       = "conclusions:action-points"
)

type Module struct {
    bun.BaseModel `bun:"table:modules"`

    Id       int64  `bun:"id,pk,autoincrement"`
    ClientId int64  `bun:"client_id,notnull"`
    Type     string `bun:"type,notnull"`
    Intro    string `bun:"intro,notnull"`
    Text     string `bun:"text,notnull"`

    Client *Client `bun:"rel:has-one,join:client_id=id"`
}

type ReportModule struct {
    Id    string
    Type  string
    Intro string
    Text  string
}

func (r *Module) ToReport() ReportModule {
    return ReportModule{
        Type:  r.Type,
        Intro: r.Intro,
        Text:  r.Text,
    }
}
