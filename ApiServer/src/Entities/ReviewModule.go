package Entities

import (
	"github.com/uptrace/bun"
)

// This list also found in 0.sql and ModuleTypes.js
var (
	ModuleTypeIntroduction = "introduction"

	ModuleTypeProfile    = "profile"
	ModuleTypeFactFind   = "profile:fact-find"
	ModuleTypeRisk       = "profile:risk"
	ModuleTypeObjectives = "profile:objectives"

	ModuleTypePolicyValuations = "policy-valuations"
	ModuleTypeValuation        = "policy-valuations:valuation"
	ModuleTypeContributions    = "policy-valuations:contributions"

	ModuleTypeFees               = "fees"
	ModuleTypeAdviceFee          = "fees:advice-fee"
	ModuleTypePolicyFees         = "fees:policy-fees"
	ModuleTypeFundLevelFees      = "fees:fund-level"
	ModuleTypePortfolioLevelFees = "fees:portfolio-level"

	ModuleTypeConclusions        = "conclusions"
	ModuleTypeAdviceGiven        = "conclusions:advice-given"
	ModuleTypeDueDiligence       = "conclusions:due-diligence"
	ModuleTypeOngoingSuitability = "conclusions:ongoing-suitability"
	ModuleTypeActionPoints       = "conclusions:action-points"
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
