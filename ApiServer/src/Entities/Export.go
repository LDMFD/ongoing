package Entities

type Draft struct {
	Id        string
	StartDate string
	EndDate   string
}

type ExportClient struct {
	Metadata ClientReport
	Draft    *Draft
	Report   ReportDetail
	Reviews  []ReportReview
}

type OrgResources struct {
	Funds           []ReportFund
	Models          []ReportModel
	ModulePresets   []ReportModulePreset
	Operators       []ReportOperator
	PolicyProviders []ReportPolicyProvider
	PolicyTypes     []ReportPolicyType
	ProviderCharges []ReportProviderCharge
	RiskProviders   []ReportRiskProvider
	RiskLevels      []ReportRiskLevel
}

type Org struct {
	Metadata  ReportOrganisation
	Resources OrgResources
	Clients   []ExportClient
	Files     []ReportFile
}

type Export struct {
	Users []ReportUser
	Orgs  []Org
}
