package Reports

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/Global/Reviews/ModulePresets/Commands"
	"ongoing/Entities"
)

func GenerateReport(c *gin.Context, clientId int64) Entities.ReportDetail {
	db := c.MustGet("DATABASE").(*bun.DB)

	var client = Entities.Client{Id: clientId}
	if err := db.NewSelect().
		Model(&client).
		Relation("RiskAssessments.RiskLevel.RiskProvider").
		Relation("RiskAssessments.Questionnaire").
		Relation("FactFinds.File").
		Relation("FeesReports.File").
		Relation("Policies.PolicyProvider.Charges.PolicyProvider").
		Relation("Policies.PolicyType").
		Relation("Policies.File").
		Relation("PolicyFunds.Policy").
		Relation("PolicyFunds.Fund.File").
		Relation("Portfolios.Model.File").
		Relation("Portfolios.Model.Operator").
		Relation("Portfolios.Policy").
		Relation("Modules").
		Relation("User").
		WherePK().
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	var report = Entities.ReportDetail{}

	// Module presets
	report.ModulePresets = make([]Entities.ReportModulePreset, 0)
	for _, preset := range Commands.GetModulePresetsInternal(c, db) {
		report.ModulePresets = append(report.ModulePresets, preset.ToReport())
	}

	// Modules
	report.Modules = make([]Entities.ReportModule, len(client.Modules))
	for ix, m := range client.Modules {
		report.Modules[ix] = m.ToReport()
	}

	// Risk Assessments, Risk Providers, Risk Levels
	report.RiskAssessments = make([]Entities.ReportRiskAssessment, 0)
	var riskProviders = map[int64]*Entities.RiskProvider{}
	var riskLevels = map[int64]*Entities.RiskLevel{}
	for _, r := range client.RiskAssessments {
		report.RiskAssessments = append(report.RiskAssessments, r.ToReport())
		riskLevels[r.RiskLevelId] = r.RiskLevel
		riskProviders[r.RiskLevel.RiskProviderId] = r.RiskLevel.RiskProvider
	}
	report.RiskProviders = make([]Entities.ReportRiskProvider, 0)
	for _, p := range riskProviders {
		report.RiskProviders = append(report.RiskProviders, p.ToReport())
	}
	report.RiskLevels = make([]Entities.ReportRiskLevel, 0)
	for _, l := range riskLevels {
		report.RiskLevels = append(report.RiskLevels, l.ToReport())
	}

	// Fact finds
	report.FactFinds = make([]Entities.ReportFactFind, 0)
	for _, f := range client.FactFinds {
		report.FactFinds = append(report.FactFinds, f.ToReport())
	}

	// Fees Reports
	report.FeesReports = make([]Entities.ReportFeesReport, 0)
	for _, f := range client.FeesReports {
		report.FeesReports = append(report.FeesReports, f.ToReport())
	}

	// Policies, Policy Types, Policy Providers, Provider Charges
	report.Policies = make([]Entities.ReportPolicy, 0)
	var policyProviders = map[int64]*Entities.PolicyProvider{}
	var policyTypes = map[int64]*Entities.PolicyType{}
	for _, pol := range client.Policies {
		report.Policies = append(report.Policies, pol.ToReport())
		policyProviders[pol.PolicyProviderId] = pol.PolicyProvider
		policyTypes[pol.PolicyTypeId] = pol.PolicyType
	}
	report.ProviderCharges = make([]Entities.ReportProviderCharge, 0)
	for _, p := range policyProviders {
		for _, pc := range p.Charges {
			report.ProviderCharges = append(report.ProviderCharges, pc.ToReport())
		}
		report.PolicyProviders = append(report.PolicyProviders, p.ToReport())
	}
	for _, p := range policyTypes {
		report.PolicyTypes = append(report.PolicyTypes, p.ToReport())
	}

	// Funds, Policy Funds
	report.PolicyFunds = make([]Entities.ReportPolicyFund, 0)
	var funds = map[int64]*Entities.Fund{}
	for _, pf := range client.PolicyFunds {
		report.PolicyFunds = append(report.PolicyFunds, pf.ToReport())
		funds[pf.FundId] = pf.Fund
	}
	for _, f := range funds {
		report.Funds = append(report.Funds, f.ToReport())
	}

	// Models, Operators, Portfolios
	report.Portfolios = make([]Entities.ReportPortfolio, 0)
	var models = map[int64]*Entities.Model{}
	var operators = map[int64]*Entities.Operator{}
	for _, p := range client.Portfolios {
		report.Portfolios = append(report.Portfolios, p.ToReport())
		models[p.ModelId] = p.Model
		operators[p.Model.OperatorId] = p.Model.Operator
	}
	for _, m := range models {
		report.Models = append(report.Models, m.ToReport())
	}
	for _, o := range operators {
		report.Operators = append(report.Operators, o.ToReport())
	}

	return report
}
