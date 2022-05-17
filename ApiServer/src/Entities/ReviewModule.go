package Entities

import (
	"github.com/uptrace/bun"
)

// This list also found in ModuleTypes.js and Modules.cs
var (
    ModuleTypeIntroduction       = "introduction"

    ModuleTypeProfile            = "profile"
    ModuleTypeFactFind           = "profile_fact_find"
    ModuleTypeRisk               = "profile_risk"
    ModuleTypeObjectives         = "profile_objectives"

    ModuleTypePolicyValuations   = "policy_valuations"
    ModuleTypeValuation          = "policy_valuations_valuation"
    ModuleTypeContributions      = "policy_valuations_contributions"

    ModuleTypeFees               = "fees"
    ModuleTypeAdviceFee          = "fees_advice_fee"
    ModuleTypePolicyFees         = "fees_policy_fees"
    ModuleTypeFundLevelFees      = "fees_fund_level"
    ModuleTypePortfolioLevelFees = "fees_portfolio_level"
    ModuleTypeDimFee             = "fees_dim"

    ModuleTypeConclusions        = "conclusions"
    ModuleTypeAdviceGiven        = "conclusions_advice_given"
    ModuleTypeGoals              = "conclusions_goals"
    ModuleTypeDueDiligence       = "conclusions_due_diligence"
    ModuleTypeOngoingSuitability = "conclusions_ongoing_suitability"
    ModuleTypeActionPoints       = "conclusions_action_points"
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
