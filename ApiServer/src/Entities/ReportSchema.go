package Entities

type ReportReview struct {
	Id            string
	Meta          ReportReviewMeta
	Report        ReportDetail
}

type ReportDetail struct {
	Id            string
	ModulePresets   []ReportModulePreset
	Modules         []ReportModule
	PolicyTypes     []ReportPolicyType
	PolicyProviders []ReportPolicyProvider
	ProviderCharges []ReportProviderCharge
	Policies        []ReportPolicy
	Funds           []ReportFund
	PolicyFunds     []ReportPolicyFund
	Operators       []ReportOperator
	Models          []ReportModel
	Portfolios      []ReportPortfolio
	RiskProviders   []ReportRiskProvider
	RiskLevels      []ReportRiskLevel
	RiskAssessments []ReportRiskAssessment
}
