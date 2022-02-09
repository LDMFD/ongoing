package Entities

import (
	"github.com/uptrace/bun"
)

// This list also found in 0.sql and ModuleTypes.js
var (
	ModuleTypeIntro              = "intro"
	ModuleTypeProfile            = "profile"
	ModuleTypeFactFind           = "fact-find"
	ModuleTypeRisk               = "risk"
	ModuleTypeObjectives         = "objectives"
	ModuleTypePolicies           = "policies"
	ModuleTypeValuation          = "valuation"
	ModuleTypePolicyFunds        = "policy-funds"
	ModuleTypeContributions      = "contributions"
	ModuleTypePortfolios         = "portfolios"
	ModuleTypePortfolio          = "portfolio"
	ModuleTypeFees               = "fees"
	ModuleTypeAdviceFee          = "advice-fee"
	ModuleTypePolicyFundFees     = "policy-fund-fees"
	ModuleTypeModelFundFees      = "model-fund-fees"
	ModuleTypeDimFee             = "dim-fee"
	ModuleTypeAdviceGiven        = "advice-given"
	ModuleTypeDueDigilence       = "due-digilence"
	ModuleTypeOngoingSuitability = "ongoing-suitability"
	ModuleTypeActionPoints       = "action-points"
)

type ReviewModule struct {
	bun.BaseModel `bun:"table:review_modules"`

	Id       int64  `bun:"id,pk,autoincrement"`
	ReviewId int64  `bun:"review_id,notnull"`
	Type     string `bun:"type,notnull"`
	Intro    string `bun:"intro,notnull"`
	Text     string `bun:"text,notnull"`

	Review *Review `bun:"rel:has-one,join:review_id=id"`
}
